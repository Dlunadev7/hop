import React from "react";
import { View } from "react-native";
import { LineChart, Grid, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Colors } from "@/constants/Colors";

export const LineChartComponent = ({
  data,
  strokeColor = "blue",
  height = 200,
}: any) => {
  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <View style={{ width: "100%", height: 250, marginTop: 48 }}>
      <View style={{ height: 200, width: "100%" }}>
        <LineChart
          style={{ flex: 1 }}
          data={data}
          svg={{ stroke: Colors.PRIMARY, strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveNatural}
        ></LineChart>
      </View>
      <XAxis
        style={{ marginTop: 10, width: "100%" }}
        data={daysOfWeek}
        formatLabel={(value, index) => daysOfWeek[index] || ""}
        contentInset={{ left: 20, right: 20 }}
        svg={{ fontSize: 12, fill: "black", textAnchor: "middle" }}
      />
    </View>
  );
};
