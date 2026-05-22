import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

const BODY_PARTS = [
  { id: 'head', label: 'Head', emoji: '🧠' },
  { id: 'eyes', label: 'Eyes', emoji: '👁️' },
  { id: 'throat', label: 'Throat', emoji: '🗣️' },
  { id: 'chest', label: 'Chest', emoji: '🫀' },
  { id: 'abdomen', label: 'Abdomen', emoji: '🫃' },
  { id: 'skin', label: 'Skin', emoji: '🩹' },
  { id: 'musculoskeletal', label: 'Muscles', emoji: '💪' },
  { id: 'neurological', label: 'Neuro', emoji: '⚡' },
  { id: 'general', label: 'General', emoji: '🩺' },
];

interface BodySelectorProps {
  selected: string;
  onSelect: (bodyPart: string) => void;
}

export function BodySelector({ selected, onSelect }: BodySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Body Area</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {BODY_PARTS.map((part) => (
          <TouchableOpacity
            key={part.id}
            style={[styles.item, selected === part.id && styles.itemSelected]}
            onPress={() => onSelect(part.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{part.emoji}</Text>
            <Text style={[styles.label, selected === part.id && styles.labelSelected]}>
              {part.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: spacing.md },
  title: { ...typography.body, color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.sm, paddingHorizontal: spacing.lg },
  scroll: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  item: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 70,
  },
  itemSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  emoji: { fontSize: 24, marginBottom: 4 },
  label: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  labelSelected: { color: colors.primary, fontWeight: '700' },
});
