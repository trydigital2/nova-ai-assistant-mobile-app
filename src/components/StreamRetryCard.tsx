import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateStreamRetry, StreamErrorCategory } from '../utils/streamRetryEngine';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface StreamRetryCardProps {
  attempt?: number;
  consecutiveFailures?: number;
  errorCategory?: StreamErrorCategory;
}

export const StreamRetryCard: React.FC<StreamRetryCardProps> = ({
  attempt = 2,
  consecutiveFailures = 2,
  errorCategory = 'TRANSIENT_NETWORK',
}) => {
  const status = calculateStreamRetry(attempt, consecutiveFailures, errorCategory);

  const getCircuitColor = () => {
    switch (status.circuitState) {
      case 'OPEN':
        return colors.error;
      case 'HALF_OPEN':
        return colors.warning;
      case 'CLOSED':
        return colors.success;
    }
  };

  const circuitColor = getCircuitColor();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.label}>RESILIENT STREAM ENGINE</Text>
          <Text style={styles.headline}>Stream Interruption Recovery</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: circuitColor + '25' }]}>
          <Text style={[styles.badgeText, { color: circuitColor }]}>
            CIRCUIT: {status.circuitState}
          </Text>
        </View>
      </View>

      {/* Main Status Hero */}
      <View style={styles.heroBox}>
        <View style={styles.heroMetric}>
          <Text style={styles.heroLabel}>ATTEMPT</Text>
          <Text style={styles.heroValue}>
            {status.currentAttempt} / {status.maxRetries}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.heroMetric}>
          <Text style={styles.heroLabel}>NEXT BACKOFF</Text>
          <Text style={[styles.heroValue, { color: colors.accent }]}>
            {(status.nextBackoffDelayMs / 1000).toFixed(1)}s
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.heroMetric}>
          <Text style={styles.heroLabel}>ERROR TYPE</Text>
          <Text style={styles.heroType}>{status.category.replace('_', ' ')}</Text>
        </View>
      </View>

      {/* Recommendation Banner */}
      <View style={styles.actionBox}>
        <Text style={styles.actionTitle}>Active Policy</Text>
        <Text style={styles.actionDesc}>{status.recommendedAction}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryLight,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
  },
  heroBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  heroMetric: {
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 2,
  },
  heroType: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
  },
  actionBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

export default StreamRetryCard;

