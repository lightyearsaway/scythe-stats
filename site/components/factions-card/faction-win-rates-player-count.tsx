import { FunctionComponent } from 'react';
import { useStyletron } from 'baseui';
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';
import { Block } from 'baseui/block';
import { LabelMedium } from 'baseui/typography';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Legend,
  LegendValueFormatter,
  ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

import GQL from '../../lib/graphql';

const WIN_RATE_LINE_NAME = 'win rate';
const EXPECTED_WIN_RATE_LINE_NAME = 'expected win rate';

interface Props {
  faction: GQL.Faction;
}

const FactionWinRatesByPlayerCount: FunctionComponent<Props> = ({
  faction
}) => {
  const [css] = useStyletron();
  const data = faction.statsByPlayerCount.map(
    ({ playerCount, totalMatches, totalWins }) => {
      const winRate = (100 * totalWins) / totalMatches;

      return {
        playerCount,
        value: winRate,
        basis: 100 / playerCount
      };
    }
  );

  const renderLegendContent: LegendValueFormatter = value => {
    if (value === EXPECTED_WIN_RATE_LINE_NAME) {
      return (
        <LabelMedium
          overrides={{
            Block: {
              style: {
                display: 'inline-flex',
                alignItems: 'center'
              }
            }
          }}
        >
          {value}
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            content={() => (
              <Block>
                the expected win rate, assuming factions are equally balanced
              </Block>
            )}
          >
            <div
              className={css({
                display: 'inline-flex',
                color: '#212121',
                cursor: 'pointer',
                margin: '0 7px'
              })}
            >
              <FontAwesomeIcon icon={faInfo} size="xs" />
            </div>
          </StatefulTooltip>
        </LabelMedium>
      );
    }

    return (
      <LabelMedium
        overrides={{
          Block: {
            style: {
              display: 'inline'
            }
          }
        }}
      >
        {value}
      </LabelMedium>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data}>
        <Tooltip
          formatter={(value, name, b) => {
            console.log(value, b);
            const winRate = `${Number(value).toFixed(2)}%`;
            const capitalizedName = name
              .split(' ')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
            return [winRate, capitalizedName];
          }}
          labelFormatter={(playerCount: number) => {
            return `${playerCount} Players`;
          }}
        />
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="playerCount" />
        <YAxis
          width={40}
          tickFormatter={val => {
            return `${val}%`;
          }}
        />
        <Legend formatter={renderLegendContent} />
        <Line name={WIN_RATE_LINE_NAME} dataKey="value" strokeWidth={4} />
        <Line
          name={EXPECTED_WIN_RATE_LINE_NAME}
          dataKey="basis"
          type="basis"
          dot={false}
          stroke="#636e72"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FactionWinRatesByPlayerCount;
