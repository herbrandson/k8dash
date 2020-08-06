import _ from 'lodash';
import React from 'react';
import Chart from './chart';
import LoadingChart from './loadingChart';
import {parseRam, TO_GB} from '../utils/unitHelpers';
import {TODO} from "../utils/types";

export default function RamChart({items, metrics}: {items: TODO[], metrics: TODO[]}) {
    const totals = getPodRamTotals(items, metrics);
    const decimals = totals && totals.used > 10 ? 1 : 2;

    return (
        <div className='charts_item'>
            {totals ? (
                <Chart
                    decimals={decimals}
                    used={totals && totals.used}
                    usedSuffix='Gb'
                    available={totals && totals.available}
                    availableSuffix='Gb'
                />
            ) : (
                <LoadingChart />
            )}
            <div className='charts_itemLabel'>Pod Ram Use</div>
            <div className='charts_itemSubLabel'>Actual vs Reserved</div>
        </div>
    );
}

export function getPodRamTotals(items:TODO[], metrics:TODO[]) {
    if (!items || !metrics) return null;

    const metricsContainers = Object.values(metrics).flatMap(x => x.containers);
    const podContainers = items
        .flatMap(x => x.spec.containers)
        .filter(x => x.resources && x.resources.requests);

    const used = _.sumBy(metricsContainers, x => parseRam(x.usage.memory)) / TO_GB;
    const available = _.sumBy(podContainers, x => parseRam(x.resources.requests.memory)) / TO_GB;

    return {used, available};
}
