import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoutingDecision } from '../utils/modelRouterEngine';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface ModelRouterCardProps {
  decision: RoutingDecision;
}

export const ModelRouterCard: React.FC<ModelRouterCardProps> = ({ decision }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.badgeLabel}>AI MODEL ROUTER</Text>
          <Text style={styles.modelName}>{decision.selectedModel.displayName}</Text>
        </View>
        <View style={styles.strategyPill}>
          <Text style={styles.strategyText}>
            {decision.strategy.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Hero Stats */}
      <View style={styles.heroRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. Latency</Text>
          <Text style={styles.statValue}>{decision.estimatedLatencyMs}ms</Text>
          <Text style={styles.statSub}>Provider: {decision.selectedModel.provider}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. Cost</Text>
          <Text style={[styles.statValue, { color: colors.accentLight }]}>
            ${decision.estimatedCostUSD.toFixed(5)}
          </Text>
          <Text style={styles.statSub}>
            {decision.costSavingsPercent > 0
              ? `${decision.costSavingsPercent}% cheaper than max`
              : 'Direct pricing'}
          </Text>
        </View>
      </View>

      {/* Quality Benchmark Bar */}
      <View style={styles.qualityContainer}>
        <View style={styles.qualityHeader}>
          <Text style={styles.qualityLabel}>MMLU Benchmark Score</Text>
          <Text style={styles.qualityValue}>{decision.selectedModel.qualityScore} / 100</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${decision.selectedModel.qualityScore}%` }]} />
        </View>
      </View>

      {/* Recommendation Reason */}
      <View style={styles.reasonBox}>
        <Text style={styles.reasonTitle}>ROUTING REASON</Text>
        <Text style={styles.reasonText}>{decision.recommendationReason}</Text>
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
  strategyPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  strategyText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  qualityContainer: {
    marginBottom: spacing.md,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  qualityLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  qualityValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  track: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  reasonBox: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  reasonTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryLight,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  reasonText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});

export default ModelRouterCard;
