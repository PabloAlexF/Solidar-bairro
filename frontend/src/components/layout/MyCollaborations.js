import React, { useState, useEffect } from 'react';
import CollaborationCard from '../ui/CollaborationCard';
import ApiService from '../../services/apiService';

const MyCollaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMyCollaborations();
  }, []);

  const loadMyCollaborations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMeusInteresses();
      if (response.success) {
        setCollaborations(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCollaborationFinish = (interesseId) => {
    // Atualizar a lista após finalizar uma colaboração
    loadMyCollaborations();
  };

  if (loading) {
    return <div className="loading">Carregando colaborações...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="my-collaborations">
      <h2>Minhas Colaborações</h2>
      
      {collaborations.length === 0 ? (
        <div className="no-collaborations">
          <p>Você ainda não tem colaborações ativas.</p>
        </div>
      ) : (
        <div className="collaborations-list">
          {collaborations.map((collaboration) => (
            <CollaborationCard
              key={collaboration.id}
              interesseId={collaboration.id}
              onFinish={handleCollaborationFinish}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCollaborations;