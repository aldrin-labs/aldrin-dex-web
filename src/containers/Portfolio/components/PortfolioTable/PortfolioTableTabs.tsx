import React from 'react';
import { withStyles, withTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    },
    appbar: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    tabColor: {
        color: '#fff'
    }
});

class TabsWrappedLabel extends React.Component {
    render() {
        const { classes, currentTab, handleTabSelect } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appbar}>
                    <Tabs value={currentTab} onChange={handleTabSelect}>
                        <Tab className={classes.tabColor} value="balances" label="My Balances" />
                        <Tab className={classes.tabColor} value="rebalanced" label="Rebalanced" />
                    </Tabs>
                </AppBar>
                {currentTab === 'balances' && <TabContainer><Typography variant="title">My Balances</Typography></TabContainer>}
                {currentTab === 'rebalanced' && <TabContainer><Typography variant="title">Rebalanced</Typography></TabContainer>}
            </div>
        );
    }
}

export const PortfolioTableTabs = withStyles(styles, { withTheme: true })(TabsWrappedLabel);

