import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AIModelId, ContextBudgetInput } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { calculateContextBudget } from '../utils/contextBudgetEngine';

export interface ContextBudgetCardProps {
  budget: ContextBudgetInput;
  initialModelId?: AIModelId;
  onModelChange?: (modelId: AIModelId) => void;
}

const AVAILABLE_MODELS: { id: AIModelId; label: string }[] = [
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5' },
  { id: 'gemini-1-5-pro', label: 'Gemini 1.5 Pro' },
];

export const ContextBudgetCard: React.FC<ContextBudgetCardProps> = ({
  budget,
  initialModelId = 'gpt-4o',
  onModelChange,
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModelId>(initialModelId);

  const breakdown = calculateContextBudget(selectedModel, budget);

  const handleSelect = (modelId: AIModelId) => {
    setSelectedModel(modelId);
    if (onModelChange) {
      onModelChange(modelId);
    }
  };

  // Percentages for segmented progress bar (clamped to 100% total track)
  const windowTokens = breakdown.contextWindowTokens;
  const sysPct = Math.min(100, (breakdown.systemPromptTokens / windowTokens) * 100);
  const userPct = Math.min(100, (breakdown.userPromptTokens / windowTokens) * 100);
  const ragPct = Math.min(100, (breakdown.ragContextTokens / windowTokens) * 100);
  const outPct = Math.min(100, (breakdown.reservedOutputTokens / windowTokens) * 100);

  const statusColor =
    breakdown.status === 'optimal'
      ? colors.success
      : breakdown.status === 'warning'
      ? colors.warning
      : colors.error;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Context Window Budget</Text>
          <Text style={styles.subtitle}>
            {(windowTokens / 1000).toFixed(0)}k Context Window · Allocation Breakdown
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '25', borderColor: statusColor }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>
            {breakdown.statusBadgeText}
          </Text>
        </View>
      </View>

      {/* Model Selector Tabs */}
      <View style={styles.tabsRow}>
        {AVAILABLE_MODELS.map((item) => {
          const isSelected = selectedModel === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Capacity Metrics */}
      <View style={styles.capacityGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Total Allocated</Text>
          <Text style={styles.metricValue}>
            {breakdown.totalAllocatedTokens.toLocaleString()}
          </Text>
          <Text style={styles.metricSub}>tokens in buffer</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Remaining Room</Text>
          <Text style={[styles.metricValue, { color: colors.accentLight }]}>
            {breakdown.remainingTokens.toLocaleString()}
          </Text>
          <Text style={styles.metricSub}>available to fill</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Utilization</Text>
          <Text style={[styles.metricValue, { color: statusColor }]}>
            {breakdown.utilizationPercentage}%
          </Text>
          <Text style={styles.metricSub}>of max limit</Text>
        </View>
      </View>

      {/* Multi-Segment Progress Bar */}
      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          <View style={[styles.barSegment, { width: `${sysPct}%`, backgroundColor: '#8B5CF6' }]} />
          <View style={[styles.barSegment, { width: `${userPct}%`, backgroundColor: '#38BDF8' }]} />
          <View style={[styles.barSegment, { width: `${ragPct}%`, backgroundColor: '#F59E0B' }]} />
          <View style={[styles.barSegment, { width: `${outPct}%`, backgroundColor: '#10B981' }]} />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendGrid}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
          <Text style={styles.legendText}>System ({breakdown.systemPromptTokens.toLocaleString()})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
          <Text style={styles.legendText}>User ({breakdown.userPromptTokens.toLocaleString()})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>RAG Doc ({breakdown.ragContextTokens.toLocaleString()})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Reserve ({breakdown.reservedOutputTokens.toLocaleString()})</Text>
        </View>
      </View>

      {/* Recommendation Diagnostic Banner */}
      <View style={styles.recommendationBanner}>
        <Text style={styles.recommendationTitle}>⚡ Optimizer Insight</Text>
        <Text style={styles.recommendationText}>{breakdown.recommendation}</Text>
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
    marginBottom: spacing.base,
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
    color: colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  tabButtonTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  capacityGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  metricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  barContainer: {
    marginBottom: spacing.sm,
  },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  recommendationBanner: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

