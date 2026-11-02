import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PromptTemplate } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export interface PromptTemplateCardProps {
  template: PromptTemplate;
  onUseTemplate?: (template: PromptTemplate) => void;
  onPress?: (template: PromptTemplate) => void;
}

export const PromptTemplateCard: React.FC<PromptTemplateCardProps> = ({
  template,
  onUseTemplate,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(template)}
    >
      <View style={styles.headerRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{template.category}</Text>
        </View>

        <View style={styles.tokenPill}>
          <Text style={styles.tokenPillText}>~{template.estimatedTokens} tokens</Text>
        </View>
      </View>

      <Text style={styles.title}>{template.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {template.description}
      </Text>

      {/* Variables & Model Info */}
      <View style={styles.metaRow}>
        <View style={styles.variablesInfo}>
          <Text style={styles.variablesLabel}>
            {template.variables.length} {template.variables.length === 1 ? 'variable' : 'variables'}:
          </Text>
          <Text style={styles.variablesList} numberOfLines={1}>
            {template.variables.map((v) => `{{${v}}}`).join(', ')}
          </Text>
        </View>
      </View>

      {/* Footer with Tags and Action */}
      <View style={styles.footerRow}>
        <View style={styles.modelTag}>
          <Text style={styles.modelTagText}>⚡ {template.defaultModel}</Text>
        </View>

        <TouchableOpacity
          style={styles.useBtn}
          onPress={() => onUseTemplate?.(template)}
          activeOpacity={0.7}
        >
          <Text style={styles.useBtnText}>Use Template →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: `${colors.primary}25`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primaryLight,
  },
  tokenPill: {
    backgroundColor: `${colors.accent}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  tokenPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  metaRow: {
    backgroundColor: `${colors.background}80`,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  variablesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  variablesLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  variablesList: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryLight,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  modelTagText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  useBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  useBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});

export default PromptTemplateCard;
