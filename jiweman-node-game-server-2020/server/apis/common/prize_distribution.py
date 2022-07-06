import numpy as np
import unittest
import math
import copy
import sys


# Dynamic entry fees : Name of  methods and members end with _VariablePrizeWinning


class TournamentDataVariablePrizeWinning:

    def __init__(self,

                 EntryFeeContributionToPrize: int,

                 RateOfParticipantsToReward: float = float('nan'),

                 MinimumReward: float = float('nan'),

                 WeightInit: float = float('nan'),

                 WeightMin: float = float('nan')):

        self.EntryFeeContributionToPrize_VariablePrizeWinning = int(
            EntryFeeContributionToPrize)

        self.RateOfParticipantsToReward_VariablePrizeWinning = float(
            RateOfParticipantsToReward)

        self.MinimumReward_VariablePrizeWinning = float(MinimumReward)

        self.WeightInit_VariablePrizeWinning = float(WeightInit)

        self.WeightMin_VariablePrizeWinning = float(WeightMin)

    def TotalPrizePool_VariablePrizeWinning(self, nPositions):

        NumberofTickets = int(
            nPositions/self.RateOfParticipantsToReward_VariablePrizeWinning)

        return NumberofTickets*self.EntryFeeContributionToPrize_VariablePrizeWinning


# old recursive method

    def PrizeDistributionRecursive_VariablePrizeWinning(self, nPositions):

        my_array = np.empty((nPositions), dtype=float)

        WininigPositionsPrize = np.empty((nPositions), dtype=float)

        proba = (self.WeightInit_VariablePrizeWinning-self.WeightMin_VariablePrizeWinning) * \
            math.exp(-nPositions+1) + self.WeightMin_VariablePrizeWinning

        if nPositions == 1:

            my_array[0] = 1.0

            return my_array

        LastPrizeDistribution = self.PrizeDistributionRecursive_VariablePrizeWinning(
            nPositions-1)

        TotalPrize = self.TotalPrizePool_VariablePrizeWinning(nPositions)

        LastTotalPrize = self.TotalPrizePool_VariablePrizeWinning(nPositions-1)

        ResidualPrizeToDistribute = TotalPrize - LastTotalPrize - \
            self.MinimumReward_VariablePrizeWinning

        for i in range(nPositions-1):

            WininigPositionsPrize[i] = LastPrizeDistribution[i] * \
                LastTotalPrize

        WininigPositionsPrize[nPositions -
                              1] = self.MinimumReward_VariablePrizeWinning

        pn = pow(1-proba, nPositions)

        for i in range(nPositions):

            WininigPositionsPrize[i] = WininigPositionsPrize[i] + \
                ResidualPrizeToDistribute * proba * pow(1-proba, i)/(1-pn)

        for i in range(nPositions):

            my_array[i] = WininigPositionsPrize[i] / TotalPrize

        NumericalRes = 1 - my_array.sum()

        my_array[0] = my_array[0] + NumericalRes

        return my_array

# Iterative way to write the algorithm, instead of the recursive one

    def PrizeDistribution_VariablePrizeWinning(self, nPositions):

        my_array = np.empty((1), dtype=float)
        my_array[0] = 1.0

        if nPositions == 1:

            return my_array

        for k in range(1, nPositions):
            WininigPositionsPrize = np.empty((k+1), dtype=float)

            proba = (self.WeightInit_VariablePrizeWinning-self.WeightMin_VariablePrizeWinning) * \
                math.exp(-k) + self.WeightMin_VariablePrizeWinning

            LastPrizeDistribution = copy.deepcopy(my_array)

            TotalPrize = self.TotalPrizePool_VariablePrizeWinning(k+1)

            LastTotalPrize = self.TotalPrizePool_VariablePrizeWinning(k)

            ResidualPrizeToDistribute = TotalPrize - LastTotalPrize - \
                self.MinimumReward_VariablePrizeWinning

            for i in range(k):

                WininigPositionsPrize[i] = LastPrizeDistribution[i] * \
                    LastTotalPrize

            WininigPositionsPrize[k] = self.MinimumReward_VariablePrizeWinning

            pn = pow(1-proba, k+1)

            for i in range(k+1):

                WininigPositionsPrize[i] = WininigPositionsPrize[i] + \
                    ResidualPrizeToDistribute * proba * pow(1-proba, i)/(1-pn)

            my_array = np.empty((k+1), dtype=float)
            for i in range(k+1):

                my_array[i] = WininigPositionsPrize[i] / TotalPrize

            NumericalRes = 1 - my_array.sum()

            my_array[0] = my_array[0] + NumericalRes

        return my_array

    def PrizeDistributionForithWinner_VariablePrizeWinning(self, ithWinner, nPositions):
        return self.PrizeDistribution_VariablePrizeWinning(nPositions)[ithWinner-1]

    def PrizeDistributionForRangeWinners_VariablePrizeWinning(self, firstWinnerinTheRange, lastWinnerinTheRange, nPositions):

        prizeDistrib = self.PrizeDistribution_VariablePrizeWinning(nPositions)
        rangeSize = (lastWinnerinTheRange-firstWinnerinTheRange+1)
        my_array = np.empty(rangeSize, dtype=float)

        for i in range(rangeSize):

            my_array[i] = prizeDistrib[firstWinnerinTheRange-1+i]

        return my_array

    def Winning_Amounts_VariablePrizeWinning(self, nPositions, LastTicket=False, nBTicketsSold=0):
        if LastTicket == False:
            return self.PrizeDistribution_VariablePrizeWinning(nPositions)*self.TotalPrizePool_VariablePrizeWinning(nPositions)
        return self.PrizeDistribution_VariablePrizeWinning(nPositions)*(nBTicketsSold*self.EntryFeeContributionToPrize_VariablePrizeWinning)

    def Winning_AmountsForithWinner_VariablePrizeWinning(self, ithWinner, nPositions, LastTicket=False, nBTicketsSold=0):
        if LastTicket == False:
            return self.PrizeDistributionForithWinner_VariablePrizeWinning(ithWinner, nPositions)*self.TotalPrizePool_VariablePrizeWinning(nPositions)
        return self.PrizeDistributionForithWinner_VariablePrizeWinning(ithWinner, nPositions)*(nBTicketsSold*self.EntryFeeContributionToPrize_VariablePrizeWinning)


# Fixed prize allocation  : Name of  methods and members end with _FixedPrizeWinning


class TournamentDataFixedPrizeWinning:

    def __init__(self,

                 FixedAmountOfPrizes: int,

                 NumberOfPrizeWinners: int,
                 MinimumReward: float = float('nan'),

                 WeightInit: float = float('nan'),

                 WeightMin: float = float('nan')):

        self.FixedAmountOfPrizes_FixedPrizeWinning = int(FixedAmountOfPrizes)

        self.NumberOfPrizeWinners_FixedPrizeWinning = int(NumberOfPrizeWinners)

        self.MinimumReward_FixedPrizeWinning = float(MinimumReward)

        self.WeightInit_FixedPrizeWinning = float(WeightInit)

        self.WeightMin_FixedPrizeWinning = float(WeightMin)
        self.Weight_FixedPrizeWinning = (self.WeightInit_FixedPrizeWinning-self.WeightMin_FixedPrizeWinning) * \
            math.exp(-NumberOfPrizeWinners+1) + \
            self.WeightMin_FixedPrizeWinning

    def PrizeDistribution_FixedPrizeWinning(self):

        my_array = np.empty(
            (self.NumberOfPrizeWinners_FixedPrizeWinning), dtype=float)
        WininigPositionsPrize = np.empty(
            (self.NumberOfPrizeWinners_FixedPrizeWinning), dtype=float)

        proba = self.Weight_FixedPrizeWinning

        if self.NumberOfPrizeWinners_FixedPrizeWinning == 1:

            my_array[0] = 1.0

            return my_array

        if self.NumberOfPrizeWinners_FixedPrizeWinning == 0:
            return my_array
        if int(self.FixedAmountOfPrizes_FixedPrizeWinning/self.NumberOfPrizeWinners_FixedPrizeWinning) <= self.MinimumReward_FixedPrizeWinning:
            for i in range(self.NumberOfPrizeWinners_FixedPrizeWinning):
                my_array[i] = 1.0/self.NumberOfPrizeWinners_FixedPrizeWinning

            return my_array

        ResidualPrizeToDistribute = self.FixedAmountOfPrizes_FixedPrizeWinning - \
            self.MinimumReward_FixedPrizeWinning * \
            self.NumberOfPrizeWinners_FixedPrizeWinning

        pn = pow(1-proba, self.NumberOfPrizeWinners_FixedPrizeWinning)

        for i in range(self.NumberOfPrizeWinners_FixedPrizeWinning):
            WininigPositionsPrize[i] = self.MinimumReward_FixedPrizeWinning

        for i in range(self.NumberOfPrizeWinners_FixedPrizeWinning):

            WininigPositionsPrize[i] = WininigPositionsPrize[i] + \
                ResidualPrizeToDistribute * proba * pow(1-proba, i)/(1-pn)

        for i in range(self.NumberOfPrizeWinners_FixedPrizeWinning):

            my_array[i] = WininigPositionsPrize[i] / \
                self.FixedAmountOfPrizes_FixedPrizeWinning

        NumericalRes = 1 - my_array.sum()

        my_array[0] = my_array[0] + NumericalRes

        return my_array

    def PrizeDistributionForithWinner_FixedPrizeWinning(self, ithWinner):

        proba = self.Weight_FixedPrizeWinning

        pn = pow(1-proba, self.NumberOfPrizeWinners_FixedPrizeWinning)

        return self.PrizeDistribution_FixedPrizeWinning()[ithWinner-1]

    def PrizeDistributionForRangeWinners_FixedPrizeWinning(self, firstWinnerinTheRange, lastWinnerinTheRange):

        prizeDistrib = self.PrizeDistribution_FixedPrizeWinning()
        rangeSize = (lastWinnerinTheRange-firstWinnerinTheRange+1)
        my_array = np.empty(rangeSize, dtype=float)

        for i in range(rangeSize):

            my_array[i] = prizeDistrib[firstWinnerinTheRange-1+i]

        return my_array

    def Winning_Amounts_FixedPrizeWinning(self):
        return self.PrizeDistribution_FixedPrizeWinning()*self.FixedAmountOfPrizes_FixedPrizeWinning

    def Winning_AmountsForithWinner_FixedPrizeWinning(self, ithWinner):
        return self.PrizeDistributionForithWinner_FixedPrizeWinning(ithWinner)*self.FixedAmountOfPrizes_FixedPrizeWinning

# Hybrid prize allocation : Fixed  + Dynamic


class TournamentDataHybridPrizeWinning(TournamentDataVariablePrizeWinning, TournamentDataFixedPrizeWinning):

    def __init__(self, EntryFeeContributionToPrize_VariablePrizeWinning, RateOfParticipantsToReward_VariablePrizeWinning, MinimumReward_VariablePrizeWinning, WeightInit_VariablePrizeWinning, WeightMin_VariablePrizeWinning, FixedAmountOfPrizes_FixedPrizeWinning, NumberOfPrizeWinners_FixedPrizeWinning, MinimumReward_FixedPrizeWinning, WeightInit_FixedPrizeWinning, WeightMin_FixedPrizeWinning):

        TournamentDataVariablePrizeWinning.__init__(self, EntryFeeContributionToPrize_VariablePrizeWinning, RateOfParticipantsToReward_VariablePrizeWinning,
                                                    MinimumReward_VariablePrizeWinning, WeightInit_VariablePrizeWinning, WeightMin_VariablePrizeWinning)

        TournamentDataFixedPrizeWinning.__init__(self, FixedAmountOfPrizes_FixedPrizeWinning, NumberOfPrizeWinners_FixedPrizeWinning,
                                                 MinimumReward_FixedPrizeWinning, WeightInit_FixedPrizeWinning, WeightMin_FixedPrizeWinning)

    def TotalPrizePool(self, nPositions):

        return TournamentDataVariablePrizeWinning.TotalPrizePool_VariablePrizeWinning(self, nPositions) + self.FixedAmountOfPrizes_FixedPrizeWinning

    def PrizeDistribution(self, nPositions):

        totalPrizePool_Hybrid = self.TotalPrizePool(nPositions)

        return self.Winning_Amounts(nPositions)/totalPrizePool_Hybrid

    def PrizeDistributionForithWinner(self, ithWinner, nPositions):

        totalPrizePool_Hybrid = self.TotalPrizePool(nPositions)
        return self.Winning_AmountsForithWinner(ithWinner, nPositions) / totalPrizePool_Hybrid

    def PrizeDistributionForRangeWinners(self, firstWinnerinTheRange, lastWinnerinTheRange, nPositions):

        prizeDistrib = self.PrizeDistribution(nPositions)
        rangeSize = (lastWinnerinTheRange-firstWinnerinTheRange+1)
        my_array = np.empty(rangeSize, dtype=float)

        for i in range(rangeSize):

            my_array[i] = prizeDistrib[firstWinnerinTheRange-1+i]

        return my_array

    def Winning_Amounts(self, nPositions, LastTicket=False, nBTicketsSold=0):
        nbWinners = max(
            nPositions, self.NumberOfPrizeWinners_FixedPrizeWinning)
        Winning_Amounts_FixedPrizeWinning = TournamentDataFixedPrizeWinning.Winning_Amounts_FixedPrizeWinning(
            self)
        Winning_Amounts_VariablePrizeWinning = TournamentDataVariablePrizeWinning.Winning_Amounts_VariablePrizeWinning(
            self, nPositions, LastTicket, nBTicketsSold)
        my_array1 = np.zeros(nbWinners, dtype=float)
        my_array2 = np.zeros(nbWinners, dtype=float)

        for i in range(Winning_Amounts_FixedPrizeWinning.size):
            my_array1[i] = Winning_Amounts_FixedPrizeWinning[i]

        for i in range(nPositions):
            my_array2[i] = Winning_Amounts_VariablePrizeWinning[i]

        return my_array1+my_array2

    def Winning_AmountsForithWinner(self, ithWinner, nPositions, LastTicket=False, nBTicketsSold=0):
        return TournamentDataFixedPrizeWinning.Winning_AmountsForithWinner_FixedPrizeWinning(self, ithWinner)+TournamentDataVariablePrizeWinning.Winning_AmountsForithWinner_VariablePrizeWinning(self, ithWinner, nPositions, LastTicket, nBTicketsSold)


class TotalPrizePool_VariablePrizeWinning_Tests(unittest.TestCase):

    def test_Winning_Amount(self):
        nPos = 2
        NbTicketSold = 50
        tData = TournamentDataVariablePrizeWinning(21, 0.04, 21, 0.6, 0.1)
        result = tData.Winning_Amounts_VariablePrizeWinning(
            nPos, True, NbTicketSold)
        print(result)
        self.assertAlmostEqual(818.69597679, result[0])
        self.assertAlmostEqual(231.30402321, result[1])


class FixedPrizeWinning_Tests(unittest.TestCase):

    def test_Winning_Amount_FixedPrizeWinning(self):

        tData = TournamentDataFixedPrizeWinning(10000, 100, 20, 0.6, 0.1)
        result = tData.Winning_Amounts_FixedPrizeWinning()
        self.assertAlmostEqual(820.02124968, result[0])
        self.assertAlmostEqual(740.01912472, result[1])


class HybridPrizeWinning_Tests(unittest.TestCase):

    def test_Winning_Amount_HybridPrizeWinning(self):

        #  data for variable/dynamic allocation
        EntryFeeContributionToPrize_VariablePrizeWinning = 21
        RateOfParticipantsToReward_VariablePrizeWinning = 0.04
        MinimumReward_VariablePrizeWinning = 40
        WeightInit_VariablePrizeWinning = 0.6
        WeightMin_VariablePrizeWinning = 0.01

        #  data for fixed allocation

        FixedAmountOfPrizes_FixedPrizeWinning = 10000
        NumberOfPrizeWinners_FixedPrizeWinning = 100
        MinimumReward_FixedPrizeWinning = 20
        WeightInit_FixedPrizeWinning = 0.6
        WeightMin_FixedPrizeWinning = 0.01

        tData_VariablePrizeWinning = TournamentDataVariablePrizeWinning(
            EntryFeeContributionToPrize_VariablePrizeWinning, RateOfParticipantsToReward_VariablePrizeWinning, MinimumReward_VariablePrizeWinning, WeightInit_VariablePrizeWinning, WeightMin_VariablePrizeWinning)
        tData_FixedPrizeWinning = TournamentDataFixedPrizeWinning(
            FixedAmountOfPrizes_FixedPrizeWinning, NumberOfPrizeWinners_FixedPrizeWinning, MinimumReward_FixedPrizeWinning, WeightInit_FixedPrizeWinning, WeightMin_FixedPrizeWinning)

        data_Hybrid = TournamentDataHybridPrizeWinning(EntryFeeContributionToPrize_VariablePrizeWinning, RateOfParticipantsToReward_VariablePrizeWinning, MinimumReward_VariablePrizeWinning, WeightInit_VariablePrizeWinning,
                                                       WeightMin_VariablePrizeWinning, FixedAmountOfPrizes_FixedPrizeWinning, NumberOfPrizeWinners_FixedPrizeWinning, MinimumReward_FixedPrizeWinning, WeightInit_FixedPrizeWinning, WeightMin_FixedPrizeWinning)

        for i in range(20):
            result_i = data_Hybrid.Winning_Amounts(20)[i]
            # check that hybrid Prize is the sum of dynamic prize and fixed prize
            self.assertAlmostEqual(result_i, tData_VariablePrizeWinning.Winning_Amounts_VariablePrizeWinning(
                20)[i]+tData_FixedPrizeWinning.Winning_Amounts_FixedPrizeWinning()[i])


class TotalPrizePoolTests():

    def test_Winning_Amount():

        leagueType = str(sys.argv[1])  # Type of League
        nPos = int(sys.argv[2])  # Number of winning position based on 4%
        # if 30rs ticket, 21 goes to entry fee contributio to prize.. 70% of entry fee
        EntryFeeContributionToPrize = int(float(sys.argv[3]))
        RateOfParticipantsToReward = float(sys.argv[4])  # 4%...default...
        MinimumReward = float(sys.argv[5])
        WeightInit = float(sys.argv[6])  # 4%...default...
        WeightMin = float(sys.argv[7])  # 4%...default...
        NbTicketSold = int(sys.argv[8])  # No of tickets sold
        # In case of fixed/hybrid, sponsored amt..
        FixedAmountOfPrizes = int(sys.argv[9])
        LastTicket = bool(sys.argv[10])
        # print(sys.argv)
        result = []
        if leagueType == 'variable':
            tData = TournamentDataVariablePrizeWinning(EntryFeeContributionToPrize,
                                                       RateOfParticipantsToReward, MinimumReward, WeightInit, WeightMin)
            result = tData.Winning_Amounts_VariablePrizeWinning(
                nPos, LastTicket, NbTicketSold)
        elif leagueType == 'fixed':
            tData = TournamentDataFixedPrizeWinning(
                FixedAmountOfPrizes, nPos, MinimumReward, WeightInit, WeightMin)
            result = tData.Winning_Amounts_FixedPrizeWinning()
        elif leagueType == 'hybrid':
            #  data for variable/dynamic allocation
            EntryFeeContributionToPrize_VariablePrizeWinning = EntryFeeContributionToPrize
            RateOfParticipantsToReward_VariablePrizeWinning = RateOfParticipantsToReward
            MinimumReward_VariablePrizeWinning = MinimumReward
            WeightInit_VariablePrizeWinning = WeightInit
            WeightMin_VariablePrizeWinning = WeightMin

            #  data for fixed allocation

            FixedAmountOfPrizes_FixedPrizeWinning = FixedAmountOfPrizes
            NumberOfPrizeWinners_FixedPrizeWinning = nPos
            MinimumReward_FixedPrizeWinning = MinimumReward
            WeightInit_FixedPrizeWinning = WeightInit
            WeightMin_FixedPrizeWinning = WeightMin

            hybrid_data = TournamentDataHybridPrizeWinning(EntryFeeContributionToPrize_VariablePrizeWinning, RateOfParticipantsToReward_VariablePrizeWinning, MinimumReward_VariablePrizeWinning, WeightInit_VariablePrizeWinning,
                                                           WeightMin_VariablePrizeWinning, FixedAmountOfPrizes_FixedPrizeWinning, NumberOfPrizeWinners_FixedPrizeWinning, MinimumReward_FixedPrizeWinning, WeightInit_FixedPrizeWinning, WeightMin_FixedPrizeWinning)
            # // print(result.Winning_Amounts(nPos, True, NbTicketSold))
            result = hybrid_data.Winning_Amounts(
                nPos, LastTicket, NbTicketSold)

        result = sorted(result,reverse=True)
        
        for x in result:
            print(round(x, 2))


if __name__ == '__main__':
    TotalPrizePoolTests.test_Winning_Amount()
