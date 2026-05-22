import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

interface RatingStarsProps {
  rating: number;
  total?: number;
}

export function RatingStars({ rating, total }: RatingStarsProps) {
  const stars = Math.round(rating);
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, i <= stars && styles.starFilled]}>★</Text>
      ))}
      {total !== undefined && (
        <Text style={styles.total}>({total})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 14, color: colors.border },
  starFilled: { color: '#FF9500' },
  total: { ...typography.caption, color: colors.textSecondary, marginLeft: 4 },
});
