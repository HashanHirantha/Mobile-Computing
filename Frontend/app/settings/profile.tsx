import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      await uploadProfileImage(uri);
    }
  };

  const uploadProfileImage = async (uri: string) => {
    if (!user) return;
    try {
      setSaving(true);
      const ext = uri.split('.').pop() ?? 'jpg';
      const filePath = `${user.id}/avatar.${ext}`;
      
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const { error: uploadError } = await supabase.storage.from('patients').upload(filePath, blob, {
        upsert: true,
        contentType: `image/${ext}`,
      });
      
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('patients').getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: urlData.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      await refreshProfile();
      Alert.alert('Success', 'Profile photo updated successfully!');
    } catch (e: any) {
      Alert.alert('Upload Failed', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <TopBar />
      <ScrollView contentContainerStyle={globalStyles.content}>
        <Text style={globalStyles.pageTitle}>Profile Settings</Text>
        <Text style={globalStyles.pageDescription}>Manage your profile information here.</Text>
        
        <View style={globalStyles.profileCard}>
          <View style={globalStyles.avatarContainer}>
            {profile?.profile_image ? (
              <Image 
                source={{ uri: profile.profile_image }} 
                style={globalStyles.avatarLarge} 
              />
            ) : (
              <View style={[globalStyles.avatarLarge, { backgroundColor: '#E1E8ED', justifyContent: 'center', alignItems: 'center' }]}>
                <Feather name="user" size={40} color="#88B0C8" />
              </View>
            )}
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
