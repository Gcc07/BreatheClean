import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

export function Button({
  label,
  size = 'medium',
  color = '#007bff',
  textColor = '#ffffff',
  style,
  onPress,
}: {
  label: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}) {
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 16 };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        backgroundColor: color,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        ...getSizeStyle()
      }, style]}
    >
      <Text style={{ color: textColor, fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16 }}>{label}</Text>
    </TouchableOpacity>
  );
}
