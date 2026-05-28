export interface GlobalInfo {
  font: string;
  fontSize: string;
  rulerInterval: string;
  showGridLines?: boolean;
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
  plannedLabor?: string;
}

export interface FormErrors {
  global: Record<string, string>;
  tasks: Record<string, Record<string, string>>;
}
