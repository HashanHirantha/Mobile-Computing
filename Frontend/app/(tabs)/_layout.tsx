import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#CDE7FA', // light blue background
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          position: 'absolute', // To make the rounded corners look good against white background
        },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#4A5568',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="stethoscope" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="check"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <MaterialCommunityIcons name="brain" size={30} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "file-clock" : "file-clock-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={26} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    backgroundColor: '#111827',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Elevate above the tab bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
