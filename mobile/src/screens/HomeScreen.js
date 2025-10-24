/**
 * Home Screen - Dashboard
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
  const { userData } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>WELCOME BACK,</Text>
        <Text style={styles.name}>{userData?.displayName?.toUpperCase()}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="cash-outline" size={32} color="#000" />
          <Text style={styles.statValue}>{userData?.skillCoinBalance || 0}</Text>
          <Text style={styles.statLabel}>SKILLCOINS</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="document-text-outline" size={32} color="#000" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>POSTS</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="checkmark-circle-outline" size={32} color="#000" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>COMPLETED</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="star-outline" size={32} color="#000" />
          <Text style={styles.statValue}>0.0</Text>
          <Text style={styles.statLabel}>RATING</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <View style={styles.actionIcon}>
            <Icon name="add" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>POST A SKILL</Text>
            <Text style={styles.actionSubtitle}>Offer your skills or request help</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Explore')}
        >
          <View style={styles.actionIcon}>
            <Icon name="search" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>EXPLORE SKILLS</Text>
            <Text style={styles.actionSubtitle}>Find skills you need</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});


