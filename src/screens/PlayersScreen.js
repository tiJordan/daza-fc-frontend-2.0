import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import api from '../services/api';
import PlayerCard from '../components/PlayerCard';

export default function PlayersScreen({ navigation }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Adicionar Jogador"
        onPress={() => navigation.navigate('AddPlayer')}
      />
      
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlayerCard player={item} />}
      />
    </View>
  );
}