import { Meta, StoryObj } from '@storybook/react-vite';
import { BroadcastTicker, TickerView } from './BroadcastTicker';
import {
  CaptureChannelDecorator,
  TelemetryDecorator,
} from '@irdashies/storybook';
import { DEMO_GROUPS } from '@irdashies/domain/broadcast/demoField';

export default {
  component: BroadcastTicker,
  title: 'widgets/BroadcastTicker',
} as Meta<typeof BroadcastTicker>;

type Story = StoryObj<typeof BroadcastTicker>;

export const Primary: Story = {
  render: () => (
    <div className="h-[72px] w-[1280px]">
      <BroadcastTicker />
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
    <div className="h-[72px] w-[1280px]">
      <TickerView
        settings={undefined}
        groups={DEMO_GROUPS}
        teamRacing={false}
        jokerLaps={1}
      />
    </div>
  ),
  decorators: [TelemetryDecorator()],
};
