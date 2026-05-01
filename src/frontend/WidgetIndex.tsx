import { Standings } from './components/Standings/Standings';
import { Input } from './components/Input';
import { Relative } from './components/Standings/Relative';
import { TrackMap } from './components/TrackMap/TrackMap';
import { FlatTrackMap } from './components/TrackMap/FlatTrackMap';
import { Weather } from './components/Weather';
import { FasterCarsFromBehind } from './components/FasterCarsFromBehind/FasterCarsFromBehind';
import { FuelCalculator } from './components/FuelCalculator';
import { BlindSpotMonitor } from './components/BlindSpotMonitor/BlindSpotMonitor';
import { GarageCover } from './components/GarageCover/GarageCover';
import { RejoinIndicator } from './components/RejoinIndicator/RejoinIndicator';
import { TelemetryInspector } from './components/TelemetryInspector/TelemetryInspector';
import { PitlaneHelper } from './components/PitlaneHelper/PitlaneHelper';
import { Tachometer } from './components/Tachometer/Tachometer';
import { Flag } from './components/Flag';
import { TwitchChat } from './components/TwitchChat/TwitchChat';
import { LapTimeLog } from './components/LapTimeLog/LapTimeLog';
import { InformationBar } from './components/InformationBar/InformationBar';
import { SlowCarAhead } from './components/SlowCarAhead/SlowCarAhead';
import { SectorDelta } from './components/SectorDelta/SectorDelta';
import { withRenderCount } from './components/OverlayContainer/renderCounter';

export {
  Standings,
  Input,
  Relative,
  TrackMap,
  FlatTrackMap,
  Weather,
  FasterCarsFromBehind,
  FuelCalculator,
  BlindSpotMonitor,
  GarageCover,
  RejoinIndicator,
  TelemetryInspector,
  PitlaneHelper,
  Tachometer,
  Flag,
  TwitchChat,
  LapTimeLog,
  InformationBar,
  SlowCarAhead,
  SectorDelta,
};

// TODO: type this better, right now the config comes from settings
/* eslint-disable @typescript-eslint/no-explicit-any */
export const WIDGET_MAP: Record<
  string,
  (config?: any) => React.JSX.Element | null
> = {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  standings: withRenderCount('standings', Standings),
  input: withRenderCount('input', Input),
  relative: withRenderCount('relative', Relative),
  map: withRenderCount('map', TrackMap),
  flatmap: withRenderCount('flatmap', FlatTrackMap),
  weather: withRenderCount('weather', Weather),
  fastercarsfrombehind: withRenderCount(
    'fastercarsfrombehind',
    FasterCarsFromBehind
  ),
  fuel: withRenderCount('fuel', FuelCalculator),
  blindspotmonitor: withRenderCount('blindspotmonitor', BlindSpotMonitor),
  garagecover: withRenderCount('garagecover', GarageCover),
  rejoin: withRenderCount('rejoin', RejoinIndicator),
  telemetryinspector: withRenderCount('telemetryinspector', TelemetryInspector),
  pitlanehelper: withRenderCount('pitlanehelper', PitlaneHelper),
  tachometer: withRenderCount('tachometer', Tachometer),
  flag: withRenderCount('flag', Flag),
  twitchchat: withRenderCount('twitchchat', TwitchChat),
  laptimelog: withRenderCount('laptimelog', LapTimeLog),
  infobar: withRenderCount('infobar', InformationBar),
  slowcarahead: withRenderCount('slowcarahead', SlowCarAhead),
  sectordelta: withRenderCount('sectordelta', SectorDelta),
};

export type WidgetId = keyof typeof WIDGET_MAP;
