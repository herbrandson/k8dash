import React from 'react';
import Base from '../components/base';
import ChartsContainer from '../components/chartsContainer';
import Filter from '../components/filter';
import {defaultSortInfo} from '../components/sorter';
import NodeStatusChart from '../components/nodeStatusChart';
import api from '../services/api';
import test from '../utils/filterHelper';
import NodesPanel from '../components/nodesPanel';
import NodeCpuChart from '../components/nodeCpuChart';
import NodeRamChart from '../components/nodeRamChart';
import getMetrics from '../utils/metricsHelpers';

export default class Nodes extends Base {
    state = {
        filter: '',
        sort: defaultSortInfo(this),
    };

    componentDidMount() {
        this.registerApi({
            items: api.node.list(items => this.setState({items})),
            metrics: api.metrics.nodes(metrics => this.setState({metrics})),
        });
    }

    render() {
        const {items, metrics, sort, filter} = this.state;

        const filtered = items && items.filter((x) => {
            const labels = x.metadata.labels || {};
            const searchableLabels = Object.entries(labels).flat();
            return test(filter, x.metadata.name, ...searchableLabels);
        });

        const filteredMetrics = getMetrics(filtered, metrics);

        return (
            <div id='content'>
                <Filter
                    text='Nodes'
                    filter={filter}
                    onChange={x => this.setState({filter: x})}
                />

                <ChartsContainer>
                    <NodeStatusChart items={filtered} />
                    <NodeCpuChart items={filtered} metrics={filteredMetrics} />
                    <NodeRamChart items={filtered} metrics={filteredMetrics} />
                </ChartsContainer>

                <NodesPanel
                    sort={sort}
                    items={filtered}
                    metrics={filteredMetrics}
                />
            </div>
        );
    }
}
