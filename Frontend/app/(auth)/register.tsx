import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profileImageUri, setProfileImageUri] = useState('');
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date());

  const { signUp } = useAuth();

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDobDate(selectedDate);
      setDateOfBirth(selectedDate.toISOString().split('T')[0]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Media library permission not granted.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    // Combine first and last name if they split them, but design shows "FULL NAME".
    // We'll just pass firstName as fullName for now, or split by space if user entered full name.
    const names = firstName.split(' ');
    const first = names[0];
    const last = names.slice(1).join(' ');
    
    let heightCm = parseFloat(height);
    let weightKg = parseFloat(weight);
    let bmi: number | undefined;

    if (!isNaN(heightCm) && !isNaN(weightKg) && heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(2));
    } else {
      heightCm = undefined as any;
      weightKg = undefined as any;
    }
    
    const { error: signUpError } = await signUp(email, password, { 
      firstName: first, 
      lastName: last,
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      profileImageUri,
      heightCm,
      weightKg,
      bmi
    });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      router.replace('/(tabs)/home');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MediGuide</Text>
          <TouchableOpacity style={[styles.iconButton, styles.userIconBg]}>
            <Feather name="user" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our wellness community and start your healing journey today.</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Feather name="camera" size={24} color={colors.textSecondary} />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>Profile Photo (Optional)</Text>
          </View>

          <Input 
            label="Full Name" 
            value={firstName} 
            onChangeText={setFirstName} 
            placeholder="John Doe" 
            leftIcon="user"
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            leftIcon="mail"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+1 234 567 8900"
            leftIcon="phone"
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={1}>
            <View pointerEvents="none">
              <Input
                label="Date of Birth"
                value={dateOfBirth}
                editable={false}
                placeholder="Select Date"
                leftIcon="calendar"
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dobDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>GENDER</Text>
            <View style={styles.pickerWrapper}>
              <Feather name="users" size={20} color={colors.textSecondary} style={styles.icon} />
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.textPrimary}
                mode="dropdown"
              >
                <Picker.Item label="Select Gender" value="" color={colors.textSecondary} />
                <Picker.Item label="Male" value="male" color={colors.textPrimary} />
                <Picker.Item label="Female" value="female" color={colors.textPrimary} />
                <Picker.Item label="Other" value="other" color={colors.textPrimary} />
              </Picker>
            </View>
          </View>
          <Input
            label="Blood Group"
            value={bloodGroup}
            onChangeText={setBloodGroup}
            placeholder="A+, O-, etc."
            leftIcon="droplet"
          />
          
          <Input
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            placeholder="e.g. 175"
            keyboardType="numeric"
            leftIcon="maximize-2"
          />
          
          <Input
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 70"
            keyboardType="numeric"
            leftIcon="activity"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            leftIcon="lock"
          />
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="••••••••"
            leftIcon="shield"
          />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Feather name="check" size={14} color={colors.surface} />}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.boldText}>Terms of Service</Text> and <Text style={styles.boldText}>Privacy Policy</Text> regarding my medical data.
            </Text>
          </TouchableOpacity>

          <Button 
            title="Create Account" 
            onPress={handleRegister} 
            loading={loading} 
            variant="black"
            shape="pill"
            style={styles.createBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button 
            title="Log In" 
            onPress={() => router.push('/(auth)/login')} 
            variant="outline"
            shape="pill"
            style={styles.loginBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceAlt },
  scroll: { flexGrow: 1, padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconButton: {
    padding: spacing.xs,
  },
  userIconBg: {
    backgroundColor: colors.authCardBg,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  titleArea: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 16,
  },
  error: { color: colors.accent, marginBottom: spacing.md, ...typography.caption },
  card: {
    backgroundColor: colors.authCardBg,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  pickerContainer: { marginBottom: spacing.md },
  pickerLabel: { ...typography.caption, color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.xs, letterSpacing: 0.5 },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingLeft: spacing.md,
    height: 54, // Match Input component height exactly
  },
  icon: { marginRight: spacing.sm },
  picker: {
    flex: 1,
    color: colors.textPrimary,
    ...Platform.select({
      ios: { marginVertical: spacing.sm },
      android: { backgroundColor: 'transparent' },
    }),
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
    paddingRight: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    marginRight: spacing.sm,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  checkboxText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createBtn: {
    paddingVertical: 18,
  },
  footer: { 
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: { 
    ...typography.body, 
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  loginBtn: {
    paddingHorizontal: spacing.xxl,
    borderColor: colors.border,
  }
});
