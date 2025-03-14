import { TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { useState } from 'react';

export function CheckBox({
  checked = false,
  size = 24,
  color = '#007bff',
  style,
  onToggle,
}: {
  checked?: boolean;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onToggle: (checked: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleCheckbox = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle(newValue);
  };

  return (
    <TouchableOpacity
      onPress={toggleCheckbox}
      style={[{
        width: size,
        height: size,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isChecked ? color : 'transparent',
      }, style]}
    >
      {isChecked && <View style={{ width: size * 0.6, height: size * 0.6, backgroundColor: 'white' }} />}
    </TouchableOpacity>
  );
}

