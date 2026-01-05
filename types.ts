
export interface NodeInfo {
  id: string;
  label: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ChatState {
  nodeId: string | null;
  nodeLabel: string | null;
  messages: Message[];
  isLoading: boolean;
}
