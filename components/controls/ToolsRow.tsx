import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import { MIN_TARGET, radius, spacing } from '@/theme/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ToolButtonProps {
  id: string;
  label: string;
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
}

function ToolButton({
  id,
  label,
  icon,
  onPress,
  disabled = false,
  active = false,
}: ToolButtonProps) {
  const theme = useTheme();
  const color = disabled ? theme.textMuted : active ? theme.accent : theme.text;

  return (
    <Pressable
      testID={`tool-${id}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        { opacity: disabled ? 0.45 : 1, borderColor: active ? theme.accent : 'transparent' },
      ]}
    >
      <Ionicons name={icon} size={24} color={color} />
      <Text maxFontSizeMultiplier={1.3} style={[styles.label, { color }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ToolsRow() {
  const canUndo = useGameStore((state) => (state.game?.history.length ?? 0) > 0);
  const canRedo = useGameStore((state) => (state.game?.redo.length ?? 0) > 0);
  const notesMode = useGameStore((state) => state.game?.notesMode ?? false);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const erase = useGameStore((state) => state.erase);
  const toggleNotesMode = useGameStore((state) => state.toggleNotesMode);
  const requestHint = useGameStore((state) => state.requestHint);

  return (
    <View style={styles.row}>
      <ToolButton
        id="undo"
        label="Undo"
        icon="arrow-undo-outline"
        onPress={undo}
        disabled={!canUndo}
      />
      <ToolButton
        id="redo"
        label="Redo"
        icon="arrow-redo-outline"
        onPress={redo}
        disabled={!canRedo}
      />
      <ToolButton id="erase" label="Erase" icon="backspace-outline" onPress={erase} />
      <ToolButton
        id="notes"
        label="Notes"
        icon={notesMode ? 'create' : 'create-outline'}
        onPress={toggleNotesMode}
        active={notesMode}
      />
      <ToolButton id="hint" label="Hint" icon="bulb-outline" onPress={requestHint} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' },
  button: {
    minWidth: MIN_TARGET,
    minHeight: MIN_TARGET + spacing.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderRadius: radius.md,
  },
  label: { fontSize: 12 },
});
