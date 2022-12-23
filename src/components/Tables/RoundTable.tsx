import React, { useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Grid, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import TwitterIcon from '@mui/icons-material/Twitter';

interface Member {
  name: string;
  role: 'Majesty' | 'Knight';
  color: string;
  offering: number;
  rewardShare: number;
}

interface Notification {
  [key: string]: boolean;
}

const columns: GridColDef[] = [
  { field: `name`, flex: 1, headerName: `Name`, maxWidth: 200 },
  { field: `role`, flex: 1, headerName: `Role`, maxWidth: 100 },
  { field: `color`, flex: 1, headerName: `Color`, maxWidth: 100 },
  {
    field: `offering`,
    flex: 1,
    headerName: `Offering`,
    type: `numeric`,
    maxWidth: 150,
  },
  {
    field: `rewardShare`,
    headerName: `Reward Share`,
    flex: 1,
    type: `numeric`,
    maxWidth: 150,
  },
  {
    field: `notifications`,
    headerName: `Notifications`,
    flex: 1,
    maxWidth: 150,
    renderCell: ({ value }) =>
      value ? (
        <IconButton aria-label="Show notifications">
          <RefreshIcon />
        </IconButton>
      ) : null,
  },
];

const RoundTable: React.FC = () => {
  const [roundTable, setRoundTable] = React.useState<Member[]>([]);
  const [notifications, setNotifications] = React.useState<Notification>({});

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/round-table`);
      // const data = await res.json();
      const data = {
        roundTable: [
          {
            name: `Arthur`,
            role: `Majesty`,
            color: `blue`,
            offering: 100,
            rewardShare: 0.5,
          },
          {
            name: `Lancelot`,
            role: `Knight`,
            color: `red`,
            offering: 50,
            rewardShare: 0.25,
          },
          {
            name: `Galahad`,
            role: `Knight`,
            color: `green`,
            offering: 25,
            rewardShare: 0.125,
          },
          {
            name: `Percival`,
            role: `Knight`,
            color: `yellow`,
            offering: 12.5,
            rewardShare: 0.0625,
          },
        ] as Member[],
        notifications: {
          Arthur: true,
        },
      };
      setRoundTable(data.roundTable);
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const icons = [
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
    `perawallet_logo.svg`,
  ];

  const createImages = (imagePaths) => {
    return [
      {
        src: imagePaths[0],
        top: 0,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
      },
      {
        src: imagePaths[1],
        top: `14.14%`,
        left: `85.86%`,
        transform: `translate(-50%, -50%)`,
      },
      {
        src: imagePaths[2],
        top: `50%`,
        right: 0,
        transform: `translate(50%, -50%)`,
      },
      {
        src: imagePaths[3],
        top: `85.86%`,
        right: `14.14%`,
        transform: `translate(50%, -50%)`,
      },
      {
        src: imagePaths[4],
        bottom: 0,
        left: `50%`,
        transform: `translate(-50%, 50%)`,
      },
      {
        src: imagePaths[5],
        bottom: `14.14%`,
        left: `14.14%`,
        transform: `translate(-50%, 50%)`,
      },
      {
        src: imagePaths[6],
        bottom: `50%`,
        left: 0,
        transform: `translate(-50%, 50%)`,
      },
      {
        src: imagePaths[7],
        bottom: `85.86%`,
        left: `85.86%`,
        transform: `translate(-50%, 50%)`,
      },
    ];
  };

  const images = createImages(icons);

  return (
    <Grid container>
      <Grid item xs={12}>
        <ul
          style={{
            border: `solid 5px tomato`,
            borderRadius: `50%`,
            height: `20em`,
            listStyle: `none`,
            margin: `5em auto 0`,
            padding: 0,
            position: `relative`,
            width: `20em`,

            '& > *': {
              display: `block`,
              height: `6em`,
              margin: `-3em`,
              position: `absolute`,
              top: `50%`,
              left: `50%`,
              width: `6em`,
            },
          }}
        >
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
          <li>
            <img src="perawallet_logo.svg" alt="..." />
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default RoundTable;
