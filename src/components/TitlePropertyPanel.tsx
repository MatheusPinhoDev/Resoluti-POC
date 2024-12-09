import styled from 'styled-components';

interface TituloConfig {
  cor: string;
  tamanhoFonte: string;
  tipo: 'h1' | 'h2' | 'h3';
  texto: string;
}

interface TitlePropertyPanelProps {
  config: TituloConfig;
  onConfigUpdate: (novaConfig: TituloConfig) => void;
}

const PainelContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-left: 1px solid #ddd;
  width: 250px;
`;

const Grupo = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
`;

const TitlePropertyPanel: React.FC<TitlePropertyPanelProps> = ({
  config,
  onConfigUpdate
}) => {
  return (
    <PainelContainer>
      <h3>Propriedades do Título</h3>
      
      <Grupo>
        <Label>Texto:</Label>
        <Input
          type="text"
          value={config.texto}
          onChange={(e) => onConfigUpdate({ ...config, texto: e.target.value })}
        />
      </Grupo>

      <Grupo>
        <Label>Tipo:</Label>
        <Select
          value={config.tipo}
          onChange={(e) => onConfigUpdate({ 
            ...config, 
            tipo: e.target.value as 'h1' | 'h2' | 'h3'
          })}
        >
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
        </Select>
      </Grupo>

      <Grupo>
        <Label>Cor:</Label>
        <Input
          type="color"
          value={config.cor}
          onChange={(e) => onConfigUpdate({ ...config, cor: e.target.value })}
        />
      </Grupo>

      <Grupo>
        <Label>Tamanho da Fonte:</Label>
        <Input
          type="text"
          value={config.tamanhoFonte}
          onChange={(e) => onConfigUpdate({ ...config, tamanhoFonte: e.target.value })}
          placeholder="Ex: 24px"
        />
      </Grupo>
    </PainelContainer>
  );
};

export default TitlePropertyPanel;