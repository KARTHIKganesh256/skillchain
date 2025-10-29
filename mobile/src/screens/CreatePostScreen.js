import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function CreatePostScreen({ navigation }) {
  const [formData, setFormData] = useState({ title: '', description: '', type: 'offer', category: 'Programming', skillCoins: '50' });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Post created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>POST TYPE *</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity style={[styles.typeButton, formData.type === 'offer' && styles.typeButtonActive]} onPress={() => setFormData({...formData, type: 'offer'})}>
            <Text style={[styles.typeButtonText, formData.type === 'offer' && styles.typeButtonTextActive]}>I OFFER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeButton, formData.type === 'request' && styles.typeButtonActive]} onPress={() => setFormData({...formData, type: 'request'})}>
            <Text style={[styles.typeButtonText, formData.type === 'request' && styles.typeButtonTextActive]}>I NEED</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>TITLE *</Text>
        <TextInput style={styles.input} placeholder="e.g., Expert React Developer" value={formData.title} onChangeText={(text) => setFormData({...formData, title: text})} />

        <Text style={styles.label}>DESCRIPTION *</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your skill or what you need..." value={formData.description} onChangeText={(text) => setFormData({...formData, description: text})} multiline numberOfLines={4} />

        <Text style={styles.label}>SKILLCOINS *</Text>
        <TextInput style={styles.input} placeholder="50" value={formData.skillCoins} onChangeText={(text) => setFormData({...formData, skillCoins: text})} keyboardType="numeric" />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>CREATE POST</Text>
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
  content: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#000',
  },
  typeButtonText: {
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


