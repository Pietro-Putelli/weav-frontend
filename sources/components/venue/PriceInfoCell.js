import React from "react"
import {View} from "react-native";
import {useTheme} from "../../hooks";
import {MainText} from "../texts";
import {SquareImage} from "../images";
import {icons} from "../../styles";

const PriceInfoCell = ({priceInfo}) => {
    const theme = useTheme()

    return <View style={[theme.styles.shadow_round, {
        flexDirection: "row",
        alignItems: "center",
        padding: "4%",
        marginTop: "3%",
        marginHorizontal: "3%"
    }]}>
        <SquareImage percentage={0.9} coloredIcon source={icons.Price}/>
        <MainText style={{marginLeft: "4%"}} font={"subtitle-1"}>
            {priceInfo}
        </MainText>
    </View>
}

export default PriceInfoCell