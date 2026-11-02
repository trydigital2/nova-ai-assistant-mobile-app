import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TokenCostEstimate } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface TokenUsageAnalyticsCardProps {
  estimates: TokenCostEstimate[];
  totalSessionsPromptCount?: number;
}

export const TokenUsageAnalyticsCard: React.FC<TokenUsageAnalyticsCardProps> = ({
  estimates,
  totalSessionsPromptCount = 28,
}) => {
  const primaryEstimate = estimates[0];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>AI Inference & Token Analytics</Text>
          <Text style={styles.subtitle}>
            {totalSessionsPromptCount} Prompts Executed Today · Live Cost Comparison
          </Text>
        </View>
        <View style={styles.pulseBadge}>
          <Text style={styles.pulseBadgeText}>LIVE</Text>
        </View>
      </View>

      {/* Token Distribution Stats */}
      {primaryEstimate && (
        <View style={styles.tokenStatsRow}>
          <View style={styles.tokenStat}>
            <Text style={styles.statValue}>{primaryEstimate.inputTokens}</Text>
            <Text style={styles.statLabel}>Input Tokens</Text>
            <Text style={styles.statSub}>Prompt Context</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.tokenStat}>
            <Text style={styles.statValue}>{primaryEstimate.outputTokens}</Text>
            <Text style={styles.statLabel}>Output Tokens</Text>
            <Text style={styles.statSub}>Generated Reply</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.tokenStat}>
            <Text style={[styles.statValue, { color: colors.accentLight }]}>
              {primaryEstimate.totalTokens}
            </Text>
            <Text style={styles.statLabel}>Total Tokens</Text>
            <Text style={styles.statSub}>Session Load</Text>
          </View>
        </View>
      )}

      {/* Multi-Model Cost Comparison Table */}
      <Text style={styles.sectionHeader}>Model Cost & Efficiency Comparison</Text>
      <View style={styles.tableContainer}>
        {estimates.map((est) => (
          <View key={est.modelId} style={styles.tableRow}>
            <View style={styles.modelInfo}>
              <Text style={styles.modelName}>{est.modelName}</Text>
              <Text style={styles.tokenCount}>{est.totalTokens} Tokens</Text>
            </View>
            <View style={styles.costBadge}>
              <Text style={styles.costText}>{est.formattedCost}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Advisory Insight */}
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>
          💡 <strong>Tip:</strong> Gemini 1.5 Pro provides 60% lower cost per million tokens for bulk research, while Claude 3.5 Sonnet leads in algorithmic code synthesis.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pulseBadge: {
    backgroundColor: `${colors.accent}25`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  pulseBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  tokenStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  tokenStat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    height: '70%',
    alignSelf: 'center',
  },
  sectionHeader: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  tableContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  modelInfo: {
    gap: 2,
  },
  modelName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  tokenCount: {
    fontSize: 10,
    color: colors.textMuted,
  },
  costBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  costText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryLight,
  },
  insightBox: {
    backgroundColor: `${colors.primary}12`,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  insightText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});

export default TokenUsageAnalyticsCard;
