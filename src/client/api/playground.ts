import Experiment from ':entities/experiment';

export async function getExperiments(): Promise<Experiment[]> {
  const response = await fetch('/api/playground/experiments');

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function getExperiment(id: string): Promise<Experiment> {
  const response = await fetch(`/api/playground/experiments/${id}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
