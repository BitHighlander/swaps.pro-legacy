import { useEffect, useState, useCallback, FC } from "react";
import { PieChart, Pie, Sector } from 'recharts';
import { useWallet } from "context/WalletProvider/WalletProvider";
import { HStack, Stack, Text, VStack } from "@chakra-ui/react";

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="#fff"
            >{`$${value}`}</text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#f0f0f0"
            >
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export const BalancesChart: FC = () => {
    const { state } = useWallet()

    const [activeIndex, setActiveIndex] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [bals, setBals] = useState([
        { name: "Coin 1", value: 400 }
    ])

    useEffect(() => {
        if (!state.balances) return
        setBals(state.balances.map((bal) => {
            return { name: bal.symbol ?? "", value: Number(bal.valueUsd) }
        }))
        let val = 0;
        state.balances.map((bal) => val += Number(bal.valueUsd))
        setPortfolioValue(val)
    }, [state.balances])

    const onPieEnter = useCallback(
        (_, index) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    if (!state.balances) return <p>Loading...</p>

    return (
        <HStack justifyContent='center' alignItems='center'>
            <VStack>
                <Text fontSize="xl" fontWeight="bold">Estimated Balance</Text>
                <Text fontSize="xl">≈ ${portfolioValue}</Text>
            </VStack>
            <PieChart width={400} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={bals}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                />
            </PieChart>
        </HStack>
    );
}




