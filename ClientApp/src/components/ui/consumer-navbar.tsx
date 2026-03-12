import { StyleSheet, View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type ConsumerNavbarProps = {
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
};

export function ConsumerNavbar({
  onLeftPress,
  onRightPress,
  onSearch,
  placeholder = 'Buscar mascotas...',
}: ConsumerNavbarProps) {
  const [query, setQuery] = useState('');

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.logoContainer} onPress={onLeftPress} activeOpacity={0.7}>
        <Image source={require('@/../assets/images/Logo3.png')} style={styles.iconButton} />
        <Text numberOfLines={1} style={styles.textLogo}>Portal Mascotas</Text>
      </TouchableOpacity>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#8B5E3C" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#A0896E"
          value={query}
          onChangeText={handleChangeText}
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity style={styles.iconButton} onPress={onRightPress} activeOpacity={0.7}>
        <Ionicons name="person-circle-outline" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8B5E3C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    maxWidth: '50%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    outlineColor: 'transparent',
  },
  textLogo: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    position: 'fixed',
    left: 65,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
