import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MessagesScreen() {
  const mockChats = [
    { id: '1', user: 'John Doe', lastMessage: 'Sounds good!', time: '2m ago', unread: 2 },
    { id: '2', user: 'Jane Smith', lastMessage: 'Thanks for the help', time: '1h ago', unread: 0 },
    { id: '3', user: 'Bob Johnson', lastMessage: 'When can we start?', time: '3h ago', unread: 1 }
  ];

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatar}>
        <Icon name="person-circle-outline" size={48} color="#000" />
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={mockChats} renderItem={renderChat} keyExtractor={(item) => item.id} ItemSeparatorComponent={() => <View style={styles.separator} />} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, chatItem: { flexDirection: 'row', padding: 16, alignItems: 'center' }, avatar: { marginRight: 12 }, chatContent: { flex: 1 }, chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, userName: { fontSize: 16, fontWeight: 'bold' }, time: { fontSize: 12, color: '#666' }, lastMessage: { fontSize: 14, color: '#666' }, unreadBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }, unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }, separator: { height: 2, backgroundColor: '#000', marginLeft: 76 } });


