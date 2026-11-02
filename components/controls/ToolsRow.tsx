import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/stores/gameStore';
import {
  border,
  icon,
  MAX_FONT_SCALE,
  MIN_TARGET,
  opacity,
  radius,
  spacing,
  type,
  weight,
} from '@/theme/tokens';

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
  icon: iconName,
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
        {
          opacity: disabled ? opacity.disabled : 1,
          borderColor: active ? theme.accent : 'transparent',
        },
      ]}
    >
      <Ionicons name={iconName} size={icon.md} color={color} />
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={[styles.label, { color }]}>
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
    borderWidth: border.control,
    borderRadius: radius.md,
  },
  label: { fontSize: type.micro, fontWeight: weight.semibold },
});
