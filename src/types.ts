export interface GlobalInfo {
  font: string;
  fontSize: string;
  rulerInterval: string;
}

export interface Task {
  id: string;
  name: string;
  duration: string;
  freeFloat: string;
  successorId: string[];
  startDate: string;
  endDate: string;
  level: number;
  isNew?: boolean;
}

export interface FormErrors {
  global: Record<string, string>;
  tasks: Record<string, Record<string, string>>;
}
