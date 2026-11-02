import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { MOCK_PROMPT_TEMPLATES } from './src/data/mockData';
import { PromptTemplate } from './src/types';
import { PromptTemplateCard } from './src/components/PromptTemplateCard';
import { TokenUsageAnalyticsCard } from './src/components/TokenUsageAnalyticsCard';
import { compareModelCosts } from './src/utils/aiEngine';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);

  const estimates = compareModelCosts(1250, 480);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>NovaAI</Text>
          <Text style={styles.brandSubtitle}>Intelligent Prompt Engineering & Inference Analytics</Text>
        </View>

        {/* Live Token Usage Analytics */}
        <TokenUsageAnalyticsCard estimates={estimates} totalSessionsPromptCount={34} />

        {/* Prompt Templates Library */}
        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Curated Prompt Engineering Workflows</Text>
          {MOCK_PROMPT_TEMPLATES.map((tmpl) => (
            <PromptTemplateCard
              key={tmpl.id}
              template={tmpl}
              onUseTemplate={(t) => setSelectedTemplate(t)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.base,
  },
  brandTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.heavy,
    color: colors.primaryLight,
  },
  brandSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  librarySection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
