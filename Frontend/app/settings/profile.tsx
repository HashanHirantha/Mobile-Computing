import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TopBar } from '../../components/TopBar';
import { colors, typography, spacing } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { globalStyles } from '../../constants/globalStyles';

import { supabase } from '../../lib/supabase';

export default function ProfileSettingsScreen() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      })
      .eq('id', user.id);
      
    setSaving(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      refreshProfile();
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleImagePick = () => {
    Alert.alert('Upload Photo', 'Image picker will open here.');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TopBar />
      <ScrollView contentContainerStyle={globalStyles.content}>
        <Text style={globalStyles.pageTitle}>Profile Settings</Text>
        <Text style={globalStyles.pageDescription}>Manage your profile information here.</Text>
        
        <View style={globalStyles.profileCard}>
          <View style={globalStyles.avatarContainer}>
            <Image 
              source={{ uri: profile?.profile_image || 'https://i.pravatar.cc/150?img=11' }} 
              style={globalStyles.avatarLarge} 
            />
            <TouchableOpacity style={globalStyles.editBadge} onPress={handleImagePick}>
              <Feather name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={globalStyles.profileInfo}>
            <Text style={globalStyles.profileName}>Profile Photo</Text>
            <Text style={globalStyles.profileTier}>Tap the camera icon to update</Text>
          </View>
        </View>
        
        <View style={styles.form}>
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>First Name</Text>
            <TextInput 
              style={globalStyles.input} 
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>Last Name</Text>
            <TextInput 
              style={globalStyles.input} 
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>Email Address</Text>
            <TextInput 
              style={globalStyles.input} 
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#999"
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.label}>Phone Number</Text>
            <TextInput 
              style={globalStyles.input} 
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[globalStyles.buttonPrimary, { marginTop: spacing.lg, opacity: saving ? 0.7 : 1 }]} 
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={globalStyles.buttonPrimaryText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});
