# INTRO
select = name,age,address{street,city},children{name}[10:],a1[-10:]{},+a2[:-30],-a3[10],a4[10],age

range = [:]
range = [10:20]
range = [10:-20]
range = [-10:30]

range = [:20]
range = [:-10]

range = [20:]
range = [-20:]

paging = []
paging = [10]
paging = [10]()
paging = [10](1)

find = ( name = "timo" and ( age >= 20 or age <= 60 ) and address.city in ["hieu","ahihi"] and address.localtion.lng <= 1000 )

# Select default

name,age

# Select with child field

address{street,city}