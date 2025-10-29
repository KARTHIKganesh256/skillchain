import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ExploreScreen() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  const mockPosts = [
    { id: '1', title: 'React Developer Available', type: 'offer', category: 'Programming', skillCoins: 50 },
    { id: '2', title: 'Need Graphic Designer', type: 'request', category: 'Design', skillCoins: 30 },
    { id: '3', title: 'Spanish Tutor', type: 'offer', category: 'Languages', skillCoins: 40 }
  ];

  useEffect(() => { setPosts(mockPosts); }, []);

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={[styles.badge, item.type === 'offer' ? styles.badgeOffer : styles.badgeRequest]}>{item.type.toUpperCase()}</Text>
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postCategory}>{item.category}</Text>
      <View style={styles.postFooter}>
        <View style={styles.coinBadge}>
          <Icon name="cash-outline" size={16} color="#000" />
          <Text style={styles.coinText}>{item.skillCoins} SC</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search skills..." value={search} onChangeText={setSearch} />
      </View>

      <FlatList data={posts} renderItem={renderPost} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderWidth: 2,
    borderColor: '#000',
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeOffer: {
    backgroundColor: '#000',
    color: '#fff',
  },
  badgeRequest: {
    borderWidth: 2,
    borderColor: '#000',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


