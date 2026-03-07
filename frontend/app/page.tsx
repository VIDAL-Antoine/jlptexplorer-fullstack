import { Container } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { GrammarPointsList } from '../components/GrammarPointsList/GrammarPointsList';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  return (
    <Container size="md" py="xl">
      <Welcome />
      <ColorSchemeToggle />
      <GrammarPointsList />
    </Container>
  );
}
