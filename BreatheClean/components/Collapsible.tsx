import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { IconSymbolName } from '@/components/ui/IconSymbol'; // Add this line
import { useColorScheme } from '@/hooks/useColorScheme';

interface CollapsibleProps {
  title: string;
  initiallyExpanded?: boolean;
  children: React.ReactNode;
  iconName: IconSymbolName; // Add this line
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, initiallyExpanded = false, children, iconName }) => {
  const [isOpen, setIsOpen] = useState(initiallyExpanded);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name={iconName} // Use the iconName prop
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  heading: {
    backgroundColor: '#rgba(255, 255, 255, 0.05)',
    borderColor: '#rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },

  content: {
    borderRadius: 20,
    marginTop: 6,
    marginLeft: 24,
  },
});
export default Collapsible;
