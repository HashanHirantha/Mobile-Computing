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

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

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
    
    const { error: signUpError } = await signUp(email, password, { firstName: first, lastName: last });
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
