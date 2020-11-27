CXXFLAGS= -g -Wall -std=c++14
ifeq ($(shell uname -o),Cygwin) && ! ($(shell ${CXX} --version | grep -i gcc),)
CXXFLAGS= -g -Wall
endif
CXX= c++
LDFLAGS= -lm -lpthread
OBJECTS= main.o field.o gamelog.o playgame.o
EXECUTABLE= manager

all: $(EXECUTABLE)
manager: $(OBJECTS)
	${CXX} -o $@ $^ $(LDFLAGS)

-include ${OBJECTS:.o=.d}

.cc.o:
	${CXX} -c ${CXXFLAGS} $*.cc -o $*.o
	${CXX} -MM ${CXXFLAGS} $*.cc > $*.d

TAGS: *.cc *.hh
	etags *.cc *.hh

clean:
	rm -f TAGS
	rm -f *.o *.d
	rm -rf *~ */*~ \#*\#

distclean: clean
	rm -f ${EXECUTABLE}
