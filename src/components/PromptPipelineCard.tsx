import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PromptPipelineSummary, PipelineStep } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface PromptPipelineCardProps {
  pipeline: PromptPipelineSummary;
  onRunPipelinePress?: () => void;
}

export const PromptPipelineCard: React.FC<PromptPipelineCardProps> = ({
  pipeline,
  onRunPipelinePress,
}) => {
  const getStatusBadge = (status: PipelineStep['status']) => {
    switch (status) {
      case 'completed':
        return { text: 'COMPLETED', color: colors.success };
      case 'running':
        return { text: 'RUNNING', color: colors.warning };
      case 'error':
        return { text: 'ERROR', color: colors.error };
      default:
        return { text: 'QUEUED', color: colors.textMuted };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{pipeline.title}</Text>
          <Text style={styles.subtitle}>{pipeline.description}</Text>
        </View>
        <View style={styles.costBadge}>
          <Text style={styles.costText}>{pipeline.formattedCost}</Text>
        </View>
      </View>

      {/* Aggregate Metrics Bar */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{pipeline.steps.length}</Text>
          <Text style={styles.metricLabel}>Chained Steps</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{pipeline.totalEstimatedTokens}</Text>
          <Text style={styles.metricLabel}>Est. Tokens</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{pipeline.totalLatencyMs}ms</Text>
          <Text style={styles.metricLabel}>Est. Latency</Text>
        </View>
      </View>

      {/* Steps Sequence */}
      <View style={styles.stepsContainer}>
        {pipeline.steps.map((step, idx) => {
          const badge = getStatusBadge(step.status);
          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepIndexCircle}>
                <Text style={styles.stepIndexText}>{idx + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeaderRow}>
                  <Text style={styles.stepName}>{step.name}</Text>
                  <View style={[styles.statusBadge, { borderColor: badge.color }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                      {badge.text}
                    </Text>
                  </View>
                </View>
                <View style={styles.stepMetaRow}>
                  <Text style={styles.modelTag}>{step.model.toUpperCase()}</Text>
                  <Text style={styles.tokensTag}>{step.estimatedTokens} tokens</Text>
                  <Text style={styles.outputKeyTag}>-> {`{{${step.outputKey}}}`}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Run Pipeline Button */}
      <TouchableOpacity
        style={styles.runButton}
        onPress={onRunPipelinePress}
        activeOpacity={0.85}
      >
        <Text style={styles.runButtonText}>⚡ Execute Pipeline Chain</Text>
      </TouchableOpacity>
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
  header: {
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
    maxWidth: '75%',
  },
  costBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  costText: {
    fontSize: typography.fontSize.xs,
    color: colors.accentLight,
    fontWeight: typography.fontWeight.bold,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  stepsContainer: {
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSecondary,
  },
  stepIndexCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepIndexText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  stepMetaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  modelTag: {
    fontSize: 10,
    color: colors.primaryLight,
  },
  tokensTag: {
    fontSize: 10,
    color: colors.textMuted,
  },
  outputKeyTag: {
    fontSize: 10,
    color: colors.accentLight,
  },
  runButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
