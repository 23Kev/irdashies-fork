import { Meta, StoryObj } from '@storybook/react-vite';
import { Broadcast, TowerView } from './Broadcast';
import { SessionTimingStoreUpdater } from '@irdashies/context';
import {
  CaptureChannelDecorator,
  TelemetryDecorator,
} from '@irdashies/storybook';
import { DEMO_GROUPS } from '@irdashies/domain/broadcast/demoField';

export default {
  component: Broadcast,
  title: 'widgets/Broadcast',
} as Meta<typeof Broadcast>;

type Story = StoryObj<typeof Broadcast>;

export const Primary: Story = {
  render: () => (
    <div className="w-[280px]">
      <SessionTimingStoreUpdater enabled={true} />
      <Broadcast />
    </div>
  ),
  decorators: [
    TelemetryDecorator('/test-data/1747384033336'),
    CaptureChannelDecorator('/test-data/1747384033336'),
  ],
};

/** A session with a joker lap: odd-numbered demo cars have run it. */
export const JokerLap: Story = {
  render: () => (
    <div className="w-[280px]">
      <TowerView
        settings={{ pageMode: 'static', staticPage: 'names' }}
        groups={DEMO_GROUPS}
        title="Joker Lap"
        focusCarIdx={5}
        changes={new Map()}
        hasTyreChoice={false}
        jokerLaps={1}
        showGrid={false}
      />
    </div>
  ),
  decorators: [TelemetryDecorator()],
};
