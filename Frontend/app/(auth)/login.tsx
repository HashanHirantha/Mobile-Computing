import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { colors, typography, spacing } from '../../constants/theme';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
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
          <View style={styles.logoContainer}>
            <Feather name="feather" size={24} color={colors.textPrimary} />
            <Text style={styles.logoText}>MediGuide</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Feather name="help-circle" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Reinvigorate your vitality with mindful health care.</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Form Card */}
        <View style={styles.card}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            FORGOT PASSWORD?
          </Link>

          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading} 
            variant="black"
            shape="pill"
            style={styles.signInBtn}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="google" size={18} color={colors.textPrimary} />
              <Text style={styles.socialText}>GOOGLE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="apple" size={18} color={colors.textPrimary} />
              <Text style={styles.socialText}>APPLE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to MediGuide? </Text>
          <Link href="/(auth)/register" style={styles.link}>
            Create an account
          </Link>
        </View>

        {/* Bottom Copyright */}
        <Text style={styles.copyright}>© 2026 MEDIGUIDE WELLNESS SYSTEMS</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.authCardBg },
  scroll: { flexGrow: 1, padding: spacing.lg, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  helpButton: {
    padding: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  titleArea: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1Serif,
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
    paddingTop: spacing.lg,
  },
  forgotLink: { 
    color: colors.textPrimary, 
    ...typography.caption, 
    fontWeight: '700',
    alignSelf: 'flex-end', 
    marginBottom: spacing.xl,
    marginTop: -spacing.sm,
  },
  signInBtn: {
    marginBottom: spacing.xl,
    paddingVertical: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dividerText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    letterSpacing: 0.5,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 100,
    gap: spacing.sm,
  },
  socialText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 'auto',
    marginBottom: spacing.xl,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  copyright: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '600',
  }
});
