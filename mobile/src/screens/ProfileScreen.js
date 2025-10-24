import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const { userData, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle-outline" size={100} color="#000" />
        </View>
        <Text style={styles.name}>{userData?.displayName}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon name="cash-outline" size={32} color="#000" />
          <Text style={styles.statValue}>{userData?.skillCoinBalance || 0}</Text>
          <Text style={styles.statLabel}>SkillCoins</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="star-outline" size={32} color="#000" />
          <Text style={styles.statValue}>0.0</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-outline" size={24} color="#000" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document-text-outline" size={24} color="#000" />
          <Text style={styles.menuText}>My Posts</Text>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="time-outline" size={24} color="#000" />
          <Text style={styles.menuText}>Transaction History</Text>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings-outline" size={24} color="#000" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#000" />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, header: { alignItems: 'center', padding: 32, borderBottomWidth: 2, borderBottomColor: '#000' }, avatarContainer: { marginBottom: 16 }, name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 }, email: { fontSize: 14, color: '#666' }, statsContainer: { flexDirection: 'row', padding: 16, gap: 16 }, statBox: { flex: 1, borderWidth: 2, borderColor: '#000', padding: 16, alignItems: 'center' }, statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 8 }, statLabel: { fontSize: 12, color: '#666', marginTop: 4 }, menuContainer: { marginTop: 16 }, menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 2, borderBottomColor: '#000' }, menuText: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 16 }, logoutItem: { borderBottomWidth: 0 } });


