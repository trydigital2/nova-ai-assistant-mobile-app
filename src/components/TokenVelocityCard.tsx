import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateStreamingVelocity } from '../utils/tokenVelocityEngine';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface TokenVelocityCardProps {
  modelName: string;
  tokenCount?: number;
  ttftMs?: number;
  durationMs?: number;
}

export const TokenVelocityCard: React.FC<TokenVelocityCardProps> = ({
  modelName,
  tokenCount = 480,
  ttftMs = 380,
  durationMs = 5200,
}) => {
  const metrics = calculateStreamingVelocity(tokenCount, ttftMs, durationMs);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.badgeLabel}>STREAMING VELOCITY</Text>
          <Text style={styles.modelName}>{modelName}</Text>
        </View>
        <View
          style={[
            styles.tierPill,
            { backgroundColor: metrics.tierColor + '20', borderColor: metrics.tierColor },
          ]}
        >
          <Text style={[styles.tierText, { color: metrics.tierColor }]}>{metrics.tier}</Text>
        </View>
      </View>

      {/* Main Velocity Hero */}
      <View style={styles.heroRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Throughput</Text>
          <Text style={[styles.statValue, { color: metrics.tierColor }]}>
            {metrics.tokensPerSecond}
            <Text style={styles.unit}> tps</Text>
          </Text>
          <Text style={styles.statSub}>Tokens per second</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Time To First Token</Text>
          <Text style={styles.statValue}>{metrics.timeToFirstTokenMs}ms</Text>
          <Text style={styles.statSub}>Initial server latency</Text>
        </View>
      </View>

      {/* Generation Stats Bar */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Generated {metrics.totalTokensGenerated} tokens in {(metrics.totalDurationMs / 1000).toFixed(1)}s
        </Text>
        <Text style={[styles.footerScore, { color: colors.accentLight }]}>
          {metrics.smoothnessScore}% Stability
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  badgeLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.primaryLight,
    letterSpacing: 0.6,
  },
  modelName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  tierPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginTop: 4,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  footerScore: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default TokenVelocityCard;
