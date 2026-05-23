const Customization = require('../models/Customization');

exports.createCustomization = async (req, res) => {
    try {
        const { productId, personalizedMessage, fontStyle, colorCode, theme } = req.body;
        const customImage = req.file ? `/uploads/${req.file.filename}` : null;

        const customization = new Customization({
            user: req.user.id,
            productId: productId === 'demo_1' ? null : productId, // Handle demo fallback
            personalizedMessage,
            fontStyle,
            colorCode,
            theme,
            customImage
        });

        await customization.save();
        res.status(201).json(customization);
    } catch (error) {
        console.error("Customization error:", error);
        res.status(400).json({ message: error.message });
    }
};

exports.getUserCustomizations = async (req, res) => {
    try {
        const customs = await Customization.find({ user: req.user.id }).populate('productId');
        res.json(customs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomizationByOrder = async (req, res) => {
    try {
        const custom = await Customization.findOne({ order: req.params.orderId });
        res.json(custom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin functions for customization approval
exports.getPendingCustomizations = async (req, res) => {
    try {
        const customs = await Customization.find({ status: 'Pending' })
            .populate('user', 'name email')
            .populate('productId')
            .sort('-createdAt');
        res.json(customs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const { adjustedPrice, adminNotes } = req.body;
        
        const customization = await Customization.findById(id);
        if (!customization) {
            return res.status(404).json({ message: 'Customization not found' });
        }
        
        customization.status = 'Approved';
        customization.adjustedPrice = adjustedPrice;
        customization.adminNotes = adminNotes;
        
        await customization.save();
        res.json(customization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNotes } = req.body;
        
        const customization = await Customization.findById(id);
        if (!customization) {
            return res.status(404).json({ message: 'Customization not found' });
        }
        
        customization.status = 'Rejected';
        customization.adminNotes = adminNotes;
        
        await customization.save();
        res.json({ message: 'Customization rejected', customization });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User response to admin decisions
exports.userRespondToCustomization = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body; // 'Accept' or 'Reject'
        
        const customization = await Customization.findById(id);
        if (!customization) {
            return res.status(404).json({ message: 'Customization not found' });
        }
        
        // Check if customization belongs to user
        if (customization.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to respond to this customization' });
        }
        
        if (response === 'Accept') {
            customization.status = 'Approved';
            // Create order from accepted customization
            const Order = require('../models/Order');
            const order = new Order({
                user: req.user.id,
                products: [{
                    product: customization.productId || '507f1f77bcf86cd799439011', // Fallback product ID
                    quantity: 1
                }],
                totalAmount: customization.adjustedPrice || 100,
                paymentMethod: 'Cash on Delivery',
                customization: customization._id,
                deliveryDetails: {
                    address: 'User Address',
                    city: 'User City',
                    phone: '0000000000'
                }
            });
            await order.save();
            
            customization.order = order._id;
        } else if (response === 'Reject') {
            customization.status = 'Rejected';
        } else {
            return res.status(400).json({ message: 'Invalid response. Must be "Accept" or "Reject"' });
        }
        
        await customization.save();
        res.json({ message: `Customization ${response}ed`, customization });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.requestPriceUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { adjustedPrice, adminNotes } = req.body;
        
        const customization = await Customization.findById(id);
        if (!customization) {
            return res.status(404).json({ message: 'Customization not found' });
        }
        
        customization.status = 'Requires Price Update';
        customization.adjustedPrice = adjustedPrice;
        customization.adminNotes = adminNotes;
        
        await customization.save();
        res.json(customization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
