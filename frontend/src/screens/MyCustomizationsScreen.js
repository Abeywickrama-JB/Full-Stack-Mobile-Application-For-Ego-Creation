import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import api from '../services/api';

const MyCustomizationsScreen = ({ navigate }) => {
    const [customizations, setCustomizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCustomizations();
    }, []);

    const fetchMyCustomizations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/customs/mycustoms');
            setCustomizations(res.data || []);
        } catch (error) {
            console.error('Error fetching customizations:', error);
            Alert.alert('Error', 'Failed to load customizations');
        } finally {
            setLoading(false);
        }
    };

    const handleRespondToCustomization = async (customizationId, response) => {
        try {
            await api.put(`/customs/${customizationId}/respond`, { response });
            Alert.alert('Success', `Customization ${response}ed successfully!`);
            fetchMyCustomizations(); // Refresh list
        } catch (error) {
            console.error('Error responding to customization:', error);
            Alert.alert('Error', 'Failed to respond to customization');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Approved': return '#10b981';
            case 'Rejected': return '#ef4444';
            case 'Requires Price Update': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'PENDING';
            case 'Approved': return 'APPROVED';
            case 'Rejected': return 'REJECTED';
            case 'Requires Price Update': return 'PRICE UPDATE';
            default: return status;
        }
    };

    const renderCustomizationItem = (item) => (
        <View key={item._id} style={styles.customizationCard}>
            <View style={styles.headerRow}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Customization Details:</Text>
                {item.personalizedMessage && (
                    <Text style={styles.detailText}>
                        Message: "{item.personalizedMessage}"
                    </Text>
                )}
                <Text style={styles.detailText}>Font: {item.fontStyle || 'Standard'}</Text>
                <Text style={styles.detailText}>Color: {item.colorCode || 'Black'}</Text>
                <Text style={styles.detailText}>Theme: {item.theme || 'Classic'}</Text>
                {item.customImage && (
                    <Image source={{ uri: `http://10.86.169.142:3000${item.customImage}` }} style={styles.customImage} />
                )}
            </View>

            {item.adminNotes && (
                <View style={styles.adminNotesSection}>
                    <Text style={styles.sectionTitle}>Admin Notes:</Text>
                    <Text style={styles.adminNotesText}>{item.adminNotes}</Text>
                </View>
            )}

            {item.adjustedPrice && (
                <View style={styles.priceSection}>
                    <Text style={styles.sectionTitle}>Updated Price:</Text>
                    <Text style={styles.priceText}>${item.adjustedPrice.toFixed(2)}</Text>
                </View>
            )}

            {/* Action buttons for user responses */}
            {item.status === 'Requires Price Update' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.acceptBtn]}
                        onPress={() => handleRespondToCustomization(item._id, 'Accept')}
                    >
                        <Text style={styles.actionBtnText}>Accept & Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleRespondToCustomization(item._id, 'Reject')}
                    >
                        <Text style={styles.actionBtnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'Approved' && item.order && (
                <View style={styles.orderInfo}>
                    <Text style={styles.orderText}>✅ Order created successfully!</Text>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.trackBtn]}
                        onPress={() => navigate('Orders')}
                    >
                        <Text style={styles.actionBtnText}>Track Order</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading customizations...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🎨 My Customizations</Text>
                <Text style={styles.headerSubtitle}>Track your personalized orders</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {customizations.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No customizations found</Text>
                        <TouchableOpacity 
                            style={styles.createBtn}
                            onPress={() => navigate('Products')}
                        >
                            <Text style={styles.createBtnText}>Create Customization</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    customizations.map(renderCustomizationItem)
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { 
        backgroundColor: '#6200ee', 
        padding: 20, 
        paddingTop: 40 
    },
    headerTitle: { 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    headerSubtitle: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 14, 
        marginTop: 4 
    },
    content: { flex: 1, padding: 16 },
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    loadingText: { 
        marginTop: 10, 
        color: '#666' 
    },
    customizationCard: { 
        backgroundColor: '#fff', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 16, 
        elevation: 2 
    },
    headerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    statusBadge: { 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    statusText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    dateText: { 
        color: '#666', 
        fontSize: 12 
    },
    detailsSection: { 
        marginBottom: 12 
    },
    sectionTitle: { 
        color: '#333', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    detailText: { 
        color: '#666', 
        fontSize: 14, 
        marginBottom: 4 
    },
    customImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 8, 
        marginTop: 8 
    },
    adminNotesSection: { 
        backgroundColor: '#f0f9ff', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12 
    },
    adminNotesText: { 
        color: '#1e40af', 
        fontSize: 14 
    },
    priceSection: { 
        backgroundColor: '#f0fdf4', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12 
    },
    priceText: { 
        color: '#16a34a', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    actionButtons: { 
        flexDirection: 'row', 
        gap: 12 
    },
    actionBtn: { 
        flex: 1, 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    acceptBtn: { 
        backgroundColor: '#10b981' 
    },
    rejectBtn: { 
        backgroundColor: '#ef4444' 
    },
    trackBtn: { 
        backgroundColor: '#6200ee' 
    },
    actionBtnText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
    orderInfo: { 
        alignItems: 'center' 
    },
    orderText: { 
        color: '#10b981', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 12 
    },
    emptyContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    emptyText: { 
        color: '#666', 
        fontSize: 16, 
        marginBottom: 20 
    },
    createBtn: { 
        backgroundColor: '#6200ee', 
        paddingHorizontal: 20, 
        paddingVertical: 12, 
        borderRadius: 8 
    },
    createBtnText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    }
});

export default MyCustomizationsScreen;
