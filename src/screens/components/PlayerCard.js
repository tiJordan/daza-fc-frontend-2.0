import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlayerCard({ player }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{player.name}</Text>
      <Text>Número: {player.number}</Text>
      <Text>Posição: {player.position}</Text>
      <Text>Idade: {player.age}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  }
});