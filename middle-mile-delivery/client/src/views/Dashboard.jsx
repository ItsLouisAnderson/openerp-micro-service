import { Grid, Box, Divider } from "@mui/material";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import { useEffect, useState } from "react";
import { request } from "api";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';

function Dashboard(props) {

    const [stats, setStats] = useState({
        lastDailyStats: [],
        today: {
            ordersMade: 0,
            ordersFinished: 0,
            tripsMade: 0,
            tripsFinished: 0
        },
        totalOrders: 0,
        totalFinishedOrder: 0,
        totalTrips: 0,
        totalFinishedTrips: 0,
        plannedTrips: 0,
        departedTrips: 0,
        canceledTrips: 0,
        atStartLocalHubOrders: 0,
        atStartRegionalHubOrders: 0,
        atEndRegionalHubOrders: 0,
        transportingOrders: 0
    })
    
    useEffect(() => {
        request("get", "/statistics/today", (res) => {
            setStats({
                lastDailyStats: res.data.dailyStats,
                today: {
                    ordersMade: res.data.todaysStats.ordersMade,
                    ordersFinished: res.data.todaysStats.ordersFinished,
                    tripsMade: res.data.todaysStats.tripsMade,
                    tripsFinished: res.data.todaysStats.tripsFinished
                },
                totalOrders: res.data.totalOrders,
                totalFinishedOrder: res.data.totalFinishedOrder,
                totalTrips: res.data.totalTrips,
                totalFinishedTrips: res.data.totalFinishedTrips,
                plannedTrips: res.data.plannedTrips,
                departedTrips: res.data.departedTrips,
                canceledTrips: res.data.canceledTrips,
                atStartLocalHubOrders: res.data.atStartLocalHubOrders,
                atStartRegionalHubOrders: res.data.atStartRegionalHubOrders,
                atEndRegionalHubOrders: res.data.atEndRegionalHubOrders,
                transportingOrders: res.data.transportingOrders
            })
        }).then();
    }, [])

    const boxStyle = {
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        padding: '5px 20px 27px 20px',
        height: '100%'
    }

    const dataStyle = {
        fontSize: '28px',
        color: '#012970',
        fontWeight: '700'
    }

    const todayDataStyle = {
        fontSize: '22px',
        color: '#012970',
        fontWeight: '700'
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <h3>Welcome back! Today is {dayjs().format('dddd, DD MMMM, YYYY')}</h3>
            <Grid container spacing={5}>
                <Grid item xs={6} md={4}>
                    <Box sx={boxStyle}>
                        <h4>Total Orders</h4>
                        <Grid container spacing={3}>
                            <Grid item>
                                <LocalPostOfficeIcon 
                                    sx={{
                                        width: '64px', 
                                        height: '64px',
                                        padding: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1976d2',
                                        color: 'white'
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <div style={dataStyle}>{stats.totalOrders}</div>
                                <div>{stats.totalFinishedOrder} completed</div>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Box sx={boxStyle}>
                        <h4>Total Trips</h4>
                        <Grid container spacing={3}>
                            <Grid item>
                                <MultipleStopIcon 
                                    sx={{
                                        width: '64px', 
                                        height: '64px',
                                        padding: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#2e7d32',
                                        color: 'white'
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <div style={dataStyle}>{stats.totalTrips}</div>
                                <div>{stats.totalFinishedTrips} completed</div>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={boxStyle}>
                        <h4>Today</h4>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <div><span style={todayDataStyle}>{stats.today.ordersMade}</span> {stats.today.ordersMade === 1 ? 'order' : 'orders'} created</div>
                                <div><span style={todayDataStyle}>{stats.today.ordersFinished}</span> {stats.today.ordersFinished === 1 ? 'order' : 'orders'} completed</div>
                            </Grid>
                            <Grid item xs={6}>
                                <div><span style={todayDataStyle}>{stats.today.tripsMade}</span> {stats.today.tripsMade === 1 ? 'trip' : 'trips'} created</div>
                                <div><span style={todayDataStyle}>{stats.today.tripsFinished}</span> {stats.today.tripsFinished === 1 ? 'trip' : 'trips'} completed</div>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={boxStyle}>
                        <h4>Order status</h4>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 'at-start-local', value: stats.atStartLocalHubOrders, label: 'At starting local hub'},
                                        { id: 'at-start-regional', value: stats.atStartRegionalHubOrders, label: 'At starting regional hub'},
                                        { id: 'at-end-regional', value: stats.atEndRegionalHubOrders, label: 'At ending regional hub'},
                                        { id: 'transporting', value: stats.transportingOrders, label: 'Being transported'},
                                        { id: 'completed', value: stats.totalFinishedOrder, label: 'Completed'}
                                    ]
                                }
                            ]}
                            height={180}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={boxStyle}>
                        <h4>Trip status</h4>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 'planned', value: stats.plannedTrips, label: 'Planned'},
                                        { id: 'departed', value: stats.departedTrips, label: 'Departed'},
                                        { id: 'completed', value: stats.totalFinishedTrips, label: 'Completed'},
                                        { id: 'canceled', value: stats.canceledTrips, label: 'Canceled'},
                                    ]
                                }
                            ]}
                            height={180}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={boxStyle}>
                        <h4>Recent Stats</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <BarChart
                                    dataset={stats.lastDailyStats}
                                    xAxis={[{ reverse: true, scaleType: 'band', dataKey: 'date', valueFormatter: (date) => dayjs(date).format('DD/MM')}]}
                                    series={[
                                        { dataKey: 'ordersMade', label: 'Orders made' },
                                        { dataKey: 'ordersFinished', label: 'Orders completed'}
                                    ]}
                                    height={400}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BarChart
                                    dataset={stats.lastDailyStats}
                                    xAxis={[{ reverse: true, scaleType: 'band', dataKey: 'date', valueFormatter: (date) => dayjs(date).format('DD/MM')}]}
                                    series={[
                                        { dataKey: 'tripsMade', label: 'Trips made' },
                                        { dataKey: 'tripsFinished', label: 'Trips completed'}
                                    ]}
                                    height={400}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default Dashboard;