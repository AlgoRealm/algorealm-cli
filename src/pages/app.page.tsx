import {
  makeStyles,
  Typography,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
} from '@mui/material';
import React, { useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/RefreshOutlined';
import PageHeader from '@/components/Headers/PageHeader';
import RoundTable from '@/components/Tables/RoundTable';

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

const Dashboard: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="🏰 AlgoRealm 👑"
        description="Claim the Crown and the Sceptre of Algorand Realm (CLI Emulator Edition)"
      />

      <Container component="main" sx={{ pt: 5 }}>
        <RoundTable />
      </Container>
    </div>
  );
};

export default Dashboard;
